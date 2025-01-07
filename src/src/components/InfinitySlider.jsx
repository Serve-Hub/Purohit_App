import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Animated } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CARD_SPACING = width * 0.02; // Smaller spacing for better alignment

const originalData = [
  { id: '1', title: 'Card 1', color: '#FFC1C1' },
  { id: '2', title: 'Card 2', color: '#C1FFC1' },
  { id: '3', title: 'Card 3', color: '#C1C1FF' },
];

const InfiniteCardSlider = () => {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const flatListRef = React.useRef(null);

  // Clone the data to simulate infinite scrolling
  const data = [...originalData, ...originalData];

  const onScrollEnd = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (CARD_WIDTH + CARD_SPACING));
    if (index === 0) {
      flatListRef.current.scrollToOffset({
        offset: originalData.length * (CARD_WIDTH + CARD_SPACING),
        animated: false,
      });
    } else if (index === data.length - 1) {
      flatListRef.current.scrollToOffset({
        offset: (originalData.length - 1) * (CARD_WIDTH + CARD_SPACING),
        animated: false,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        bounces={false}
        contentContainerStyle={{
          paddingHorizontal: (width - CARD_WIDTH) / 2, // Centering cards
        }}
        onMomentumScrollEnd={onScrollEnd}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * (CARD_WIDTH + CARD_SPACING),
            index * (CARD_WIDTH + CARD_SPACING),
            (index + 1) * (CARD_WIDTH + CARD_SPACING),
          ];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              style={[
                styles.card,
                { backgroundColor: item.color, transform: [{ scale }] },
              ]}
            >
              <Text style={styles.cardTitle}>{item.title}</Text>
            </Animated.View>
          );
        }}
        initialScrollIndex={originalData.length}
        getItemLayout={(data, index) => ({
          length: CARD_WIDTH + CARD_SPACING,
          offset: (CARD_WIDTH + CARD_SPACING) * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#f5f5f5',
  },
  card: {
    width: CARD_WIDTH,
    // height: 200,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default InfiniteCardSlider;
