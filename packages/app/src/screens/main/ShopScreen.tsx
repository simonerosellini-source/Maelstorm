import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useCharacterStore } from '../../store/characterStore';
import { supabase } from '../../services/supabase';

interface ShopItem {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'potion' | 'accessory';
  price: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  description: string;
  effect?: string;
}

const SHOP_ITEMS: ShopItem[] = [
  // Weapons
  { id: 'longsword', name: 'Longsword', type: 'weapon', price: 15, rarity: 'common', description: '1d8 slashing damage' },
  { id: 'shortsword', name: 'Shortsword', type: 'weapon', price: 10, rarity: 'common', description: '1d6 piercing damage' },
  { id: 'greataxe', name: 'Greataxe', type: 'weapon', price: 30, rarity: 'common', description: '1d12 slashing damage' },
  { id: 'longbow', name: 'Longbow', type: 'weapon', price: 50, rarity: 'common', description: '1d8 piercing, range 150/600' },
  { id: 'longsword_plus1', name: 'Longsword +1', type: 'weapon', price: 500, rarity: 'uncommon', description: '1d8+1 slashing damage', effect: '+1 to attack and damage' },
  { id: 'flametongue', name: 'Flametongue', type: 'weapon', price: 2500, rarity: 'rare', description: '1d8 slashing + 2d6 fire', effect: 'Deals extra fire damage' },

  // Armor
  { id: 'leather', name: 'Leather Armor', type: 'armor', price: 10, rarity: 'common', description: 'AC 11 + Dex modifier' },
  { id: 'chain_shirt', name: 'Chain Shirt', type: 'armor', price: 50, rarity: 'common', description: 'AC 13 + Dex (max 2)' },
  { id: 'chain_mail', name: 'Chain Mail', type: 'armor', price: 75, rarity: 'common', description: 'AC 16, heavy armor' },
  { id: 'plate', name: 'Plate Armor', type: 'armor', price: 1500, rarity: 'uncommon', description: 'AC 18, heavy armor' },
  { id: 'mithral_plate', name: 'Mithral Plate', type: 'armor', price: 5000, rarity: 'rare', description: 'AC 18, no stealth disadvantage' },

  // Potions
  { id: 'potion_healing', name: 'Potion of Healing', type: 'potion', price: 50, rarity: 'common', description: 'Restore 2d4+2 HP', effect: 'heal' },
  { id: 'potion_greater_healing', name: 'Potion of Greater Healing', type: 'potion', price: 150, rarity: 'uncommon', description: 'Restore 4d4+4 HP', effect: 'heal' },
  { id: 'potion_superior_healing', name: 'Potion of Superior Healing', type: 'potion', price: 450, rarity: 'rare', description: 'Restore 8d4+8 HP', effect: 'heal' },
  { id: 'potion_invisibility', name: 'Potion of Invisibility', type: 'potion', price: 300, rarity: 'rare', description: 'Invisible for 1 hour' },
  { id: 'potion_speed', name: 'Potion of Speed', type: 'potion', price: 400, rarity: 'rare', description: 'Haste for 1 minute' },

  // Accessories
  { id: 'ring_protection', name: 'Ring of Protection', type: 'accessory', price: 1000, rarity: 'rare', description: '+1 AC and saving throws' },
  { id: 'cloak_resistance', name: 'Cloak of Resistance', type: 'accessory', price: 600, rarity: 'uncommon', description: 'Advantage on one saving throw type' },
  { id: 'boots_speed', name: 'Boots of Speed', type: 'accessory', price: 800, rarity: 'rare', description: 'Double movement speed as bonus action' },
];

export default function ShopScreen() {
  const { currentCharacter, updateCharacter } = useCharacterStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'weapon', label: 'Weapons' },
    { id: 'armor', label: 'Armor' },
    { id: 'potion', label: 'Potions' },
    { id: 'accessory', label: 'Accessories' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? SHOP_ITEMS
    : SHOP_ITEMS.filter(item => item.type === selectedCategory);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#94a1b2';
      case 'uncommon': return '#10b981';
      case 'rare': return '#3b82f6';
      case 'epic': return '#9d4edd';
      case 'legendary': return '#f59e0b';
      default: return '#94a1b2';
    }
  };

  const buyItem = async (item: ShopItem) => {
    if (!currentCharacter) {
      setError('Create a character first!');
      return;
    }

    if (currentCharacter.gold < item.price) {
      setError(`Not enough gold! You need ${item.price} gp but have ${currentCharacter.gold} gp`);
      return;
    }

    setLoading(item.id);
    setError('');
    setMessage('');

    try {
      const newGold = currentCharacter.gold - item.price;

      // Update gold in database
      const { error: updateError } = await supabase
        .from('characters')
        .update({ gold: newGold })
        .eq('id', currentCharacter.id);

      if (updateError) throw updateError;

      // Update local store
      await updateCharacter(currentCharacter.id, { gold: newGold });

      // Apply item effect if potion
      if (item.type === 'potion' && item.effect === 'heal') {
        let healAmount = 0;
        switch (item.id) {
          case 'potion_healing':
            healAmount = Math.floor(Math.random() * 8) + 4; // 2d4+2
            break;
          case 'potion_greater_healing':
            healAmount = Math.floor(Math.random() * 16) + 8; // 4d4+4
            break;
          case 'potion_superior_healing':
            healAmount = Math.floor(Math.random() * 32) + 16; // 8d4+8
            break;
        }

        if (healAmount > 0) {
          const newHp = Math.min(
            currentCharacter.max_hit_points,
            currentCharacter.current_hit_points + healAmount
          );

          await supabase
            .from('characters')
            .update({ current_hit_points: newHp })
            .eq('id', currentCharacter.id);

          await updateCharacter(currentCharacter.id, { current_hit_points: newHp });

          setMessage(`Purchased and used ${item.name}! Restored ${healAmount} HP`);
        }
      } else {
        setMessage(`Purchased ${item.name} for ${item.price} gp!`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to purchase item');
    } finally {
      setLoading(null);
    }
  };

  const canAfford = (price: number) => {
    return currentCharacter && currentCharacter.gold >= price;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Merchant's Shop</Text>
        <Text style={styles.gold}>
          {currentCharacter ? `${currentCharacter.gold} gp` : '-- gp'}
        </Text>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {message ? (
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      ) : null}

      {currentCharacter && (
        <View style={styles.statsBar}>
          <Text style={styles.statText}>
            HP: {currentCharacter.current_hit_points}/{currentCharacter.max_hit_points}
          </Text>
          <Text style={styles.statText}>Level: {currentCharacter.level}</Text>
        </View>
      )}

      <View style={styles.categoryBar}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryButton,
              selectedCategory === cat.id && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat.id && styles.categoryTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.itemsContainer}>
        {filteredItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.itemCard,
              !canAfford(item.price) && styles.itemCardDisabled,
            ]}
            onPress={() => buyItem(item)}
            disabled={loading === item.id || !canAfford(item.price)}
          >
            <View style={styles.itemHeader}>
              <View style={styles.itemTitleRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(item.rarity) }]}>
                  <Text style={styles.rarityText}>{item.rarity}</Text>
                </View>
              </View>
              <Text style={[
                styles.itemPrice,
                canAfford(item.price) ? styles.priceAffordable : styles.priceNotAffordable,
              ]}>
                {item.price} gp
              </Text>
            </View>
            <Text style={styles.itemDesc}>{item.description}</Text>
            {item.effect && (
              <Text style={styles.itemEffect}>{item.effect}</Text>
            )}
            {loading === item.id && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator color="#9d4edd" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>Shop Tips</Text>
        <Text style={styles.tipText}>
          - Explore dungeons to earn gold
        </Text>
        <Text style={styles.tipText}>
          - Potions are consumed immediately when purchased
        </Text>
        <Text style={styles.tipText}>
          - Rarer items have more powerful effects
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  gold: { fontSize: 18, fontWeight: 'bold', color: '#fbbf24' },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#16213e',
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  statText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  categoryBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#0f3460',
  },
  categoryButtonActive: {
    backgroundColor: '#9d4edd',
  },
  categoryText: {
    color: '#94a1b2',
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  itemsContainer: {
    paddingHorizontal: 16,
  },
  itemCard: {
    backgroundColor: '#16213e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    position: 'relative',
  },
  itemCardDisabled: {
    opacity: 0.6,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  itemName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rarityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  itemPrice: { fontSize: 16, fontWeight: 'bold' },
  priceAffordable: { color: '#10b981' },
  priceNotAffordable: { color: '#ef4444' },
  itemDesc: { color: '#94a1b2', fontSize: 14 },
  itemEffect: { color: '#9d4edd', fontSize: 12, marginTop: 4, fontStyle: 'italic' },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  errorBox: {
    backgroundColor: '#ff4757',
    margin: 16,
    padding: 12,
    borderRadius: 8,
  },
  errorText: { color: '#fff', textAlign: 'center' },
  messageBox: {
    backgroundColor: '#10b981',
    margin: 16,
    padding: 12,
    borderRadius: 8,
  },
  messageText: { color: '#fff', textAlign: 'center' },
  tipCard: {
    backgroundColor: '#16213e',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  tipTitle: {
    color: '#9d4edd',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tipText: {
    color: '#94a1b2',
    fontSize: 14,
    marginBottom: 4,
  },
});
