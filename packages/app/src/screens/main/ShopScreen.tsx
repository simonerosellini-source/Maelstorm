import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function ShopScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Merchant's Shop</Text>
        <Text style={styles.gold}>💰 150 gold</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Weapons</Text>
        <TouchableOpacity style={styles.itemCard}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName}>Longsword</Text>
            <Text style={styles.itemPrice}>15 gp</Text>
          </View>
          <Text style={styles.itemDesc}>1d8 slashing damage</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemCard}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName}>Longsword +1</Text>
            <Text style={styles.itemPriceRare}>500 gp</Text>
          </View>
          <Text style={styles.itemDesc}>1d8+1 slashing damage • Uncommon</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Armor</Text>
        <TouchableOpacity style={styles.itemCard}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName}>Leather Armor</Text>
            <Text style={styles.itemPrice}>10 gp</Text>
          </View>
          <Text style={styles.itemDesc}>AC 11 + Dex modifier</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemCard}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName}>Chain Mail</Text>
            <Text style={styles.itemPrice}>75 gp</Text>
          </View>
          <Text style={styles.itemDesc}>AC 16 • Heavy armor</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Potions</Text>
        <TouchableOpacity style={styles.itemCard}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName}>Potion of Healing</Text>
            <Text style={styles.itemPrice}>50 gp</Text>
          </View>
          <Text style={styles.itemDesc}>Restore 2d4+2 HP</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemCard}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName}>Potion of Greater Healing</Text>
            <Text style={styles.itemPrice}>150 gp</Text>
          </View>
          <Text style={styles.itemDesc}>Restore 4d4+4 HP</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  gold: { fontSize: 18, fontWeight: 'bold', color: '#fbbf24' },
  card: { backgroundColor: '#16213e', margin: 16, padding: 20, borderRadius: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#9d4edd', marginBottom: 12 },
  itemCard: { backgroundColor: '#0f3460', padding: 16, borderRadius: 8, marginBottom: 12 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  itemName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  itemPrice: { color: '#10b981', fontSize: 16, fontWeight: 'bold' },
  itemPriceRare: { color: '#9d4edd', fontSize: 16, fontWeight: 'bold' },
  itemDesc: { color: '#94a1b2', fontSize: 14 },
});
