# Extended Monster Database Script

This file contains additional monsters to add to the database.
Run the script to merge with existing monsters.json

## Additional Monsters by CR

### CR 1/8
- Bandit, Cultist, Guard, Noble, Commoner, Stirge, Flying Snake

### CR 1/4
- Acolyte, Axe Beak, Blink Dog, Boar, Constrictor Snake, Draft Horse, Drow, Elk, Flying Sword, Giant Badger, Giant Bat, Giant Centipede, Giant Frog, Giant Lizard, Giant Owl, Giant Poisonous Snake, Giant Wolf Spider, Gnoll, Gob (duplicate - already have), Gray Ooze, Hobgoblin, Panther, Pixie, Pseudodragon, Pteranodon, Riding Horse, Sprite, Steam Mephit, Swarm of Bats, Swarm of Rats, Warhorse, Wolf

### CR 1/2
- Ape, Black Bear, Cockatrice, Crocodile, Darkmantle, Dust Mephit, Gas Spore, Giant Goat, Giant Sea Horse, Giant Wasp, Gnoll Pack Lord, Hobgoblin Captain, Jackal, Lizardfolk, Magma Mephit, Magmin, Reef Shark, Rust Monster, Sahuagin, Satyr, Scout, Shadow, Swarm of Insects, Thug, Warhorse Skeleton, Worg

### CR 1
- Animated Armor, Brass Dragon Wyrmling, Bronze Dragon Wyrmling, Brown Bear, Bugbear, Copper Dragon Wyrmling, Death Dog, Dire Wolf, Duergar, Ghoul, Giant Eagle, Giant Hyena, Giant Octopus, Giant Spider, Giant Toad, Giant Vulture, Goblin Boss, Half-Ogre, Harpy, Hippogriff, Imp, Lion, Quadrone, Quaggoth Spore Servant, Scarecrow, Specter, Spy, Swarm of Quippers, Thri-kreen, Tiger, Yuan-ti Pureblood

### CR 2
- Allosaurus, Ankheg, Awakened Tree, Azer, Bandit Captain, Berserker, Black Dragon Wyrmling, Blue Dragon Wyrmling, Carrion Crawler, Cult Fanatic, Druid, Ettercap, Gargoyle, Gelatinous Cube, Ghast, Giant Boar, Giant Constrictor Snake, Giant Elk, Gibbering Mouther, Green Dragon Wyrmling, Grick, Griffon, Hunter Shark, Intellect Devourer, Merrow, Mimic, Minotaur Skeleton, Ochre Jelly, Ogre Zombie, Ogre (duplicate), Orog, Pegasus, Plesiosaurus, Polar Bear, Priest, Red Dragon Wyrmling, Rhinoceros, Rug of Smothering, Saber-Toothed Tiger, Sea Hag, Silver Dragon Wyrmling, Swarm of Poisonous Snakes, Vine Blight, Warlock of the Fiend, Wererat, White Dragon Wyrmling, Will-o'-Wisp

### CR 3
- Ankylosaurus, Bearded Devil, Blue Slaad, Displacer Beast, Doppelganger, Giant Scorpion, Gold Dragon Wyrmling, Green Hag, Hell Hound, Killer Whale, Knight, Manticore, Minotaur, Mummy, Nightmare, Owlbear, Phase Spider, Veteran, Werewolf, Wight, Winter Wolf

### CR 4
- Banshee, Black Pudding, Chuul, Couatl, Elephant, Ettin, Flameskull, Ghost, Gnoll Fang of Yeenoghu, Gray Slaad, Helmed Horror, Lamia, Red Slaad, Sea Hag (Coven), Succubus/Incubus, Wereboar, Weretiger

### CR 5
- Air Elemental, Barbed Devil, Beholder Zombie, Bulette, Earth Elemental, Fire Elemental, Flesh Golem, Giant Crocodile, Giant Shark, Gladiator, Gorgon, Half-Red Dragon Veteran, Hill Giant, Night Hag, Otyugh, Roper, Salamander, Shambling Mound, Triceratops, Troll (duplicate), Umber Hulk, Unicorn, Vampire Spawn, Water Elemental, Wraith, Xorn

### CR 6
- Chimera, Cyclops, Drider, Invisible Stalker, Mage, Mammoth, Medusa, Wyvern, Young Brass Dragon, Young White Dragon

### CR 7
- Giant Ape, Mind Flayer, Night Hag (Coven), Oni, Shield Guardian, Stone Giant, Young Black Dragon, Young Copper Dragon

### CR 8
- Assassin, Chain Devil, Cloaker, Frost Giant, Hezrou, Hydra, Mind Flayer Arcanist, Spirit Naga, Tyrannosaurus Rex, Young Bronze Dragon, Young Green Dragon

### CR 9
- Bone Devil, Clay Golem, Cloud Giant, Fire Giant, Glabrezu, Treant, Young Blue Dragon, Young Silver Dragon

### CR 10
- Aboleth, Death Slaad, Guardian Naga, Stone Golem, Young Gold Dragon, Young Red Dragon (duplicate)

### CR 11
- Behir, Dao, Djinni, Efreeti, Gynosphinx, Horned Devil, Marid, Remorhaz, Roc

### CR 12
- Arcanaloth, Erinyes

### CR 13
- Adult Brass Dragon, Adult White Dragon, Beholder (duplicate), Nalfeshnee, Rakshasa, Storm Giant, Ultroloth, Vampire, Wastrilith

### CR 14
- Adult Black Dragon, Adult Copper Dragon, Ice Devil

### CR 15
- Adult Bronze Dragon, Adult Green Dragon, Mummy Lord, Purple Worm

### CR 16
- Adult Blue Dragon, Adult Silver Dragon, Iron Golem, Marilith, Planetar

### CR 17
- Adult Gold Dragon, Adult Red Dragon, Androsphinx, Death Knight, Dragon Turtle

### CR 18
- Demilich

### CR 19
- Balor

### CR 20
- Ancient Brass Dragon, Ancient White Dragon, Pit Fiend

### CR 21
- Ancient Black Dragon, Ancient Copper Dragon, Lich, Solar

### CR 22
- Ancient Bronze Dragon, Ancient Green Dragon

### CR 23
- Ancient Blue Dragon, Ancient Silver Dragon, Empyrean, Kraken

### CR 24
- Ancient Gold Dragon, Ancient Red Dragon (duplicate)

### CR 30
- Tarrasque (duplicate)

## Implementation Notes

To add these monsters, expand monsters.json with full stat blocks for each creature.
Each should include:
- Complete ability scores
- AC, HP, speed
- Skills, saves, resistances, immunities
- Traits and special abilities
- Actions (including multiattack where appropriate)
- Legendary actions for CR 11+
- Loot tables based on creature type
- Appropriate environments

## Suggested Priority Order

1. **Iconic Creatures** (CR 1-5): Goblin, Orc, Skeleton, Zombie, Owlbear, Displacer Beast, Gelatinous Cube, Rust Monster
2. **Dragons** (All colors, wyrmlings to ancient)
3. **Giants** (Hill, Stone, Frost, Fire, Cloud, Storm)
4. **Undead** (Ghoul, Wight, Wraith, Mummy, Vampire, Lich)
5. **Aberrations** (Mind Flayer, Aboleth, Beholder variants)
6. **Fiends** (Demons and Devils by hierarchy)
7. **Elementals** (Air, Earth, Fire, Water)
8. **Constructs** (Golems - Flesh, Clay, Stone, Iron)
9. **Classic D&D** (Mimic, Gelatinous Cube, Beholder, Mind Flayer)
10. **High CR Threats** (Ancient Dragons, Lich, Balor, Pit Fiend, Empyrean)
