import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../theme/colors';

interface BeatingHeartProps {
  isBeating: boolean;
  size?: number;
}

export const BeatingHeart: React.FC<BeatingHeartProps> = ({
  isBeating,
  size = 120
}) => {
  const scaleAnim1 = useRef(new Animated.Value(1)).current;
  const scaleAnim2 = useRef(new Animated.Value(1)).current;
  const scaleAnim3 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isBeating) {
      // Create a heartbeat animation - ba-dum, ba-dum
      const createHeartbeat = () => {
        return Animated.sequence([
          // First beat
          Animated.parallel([
            Animated.timing(scaleAnim1, {
              toValue: 1.15,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim2, {
              toValue: 1.1,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim3, {
              toValue: 1.05,
              duration: 150,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim1, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim2, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim3, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]),
          // Short pause
          Animated.delay(100),
          // Second beat
          Animated.parallel([
            Animated.timing(scaleAnim1, {
              toValue: 1.15,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim2, {
              toValue: 1.1,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim3, {
              toValue: 1.05,
              duration: 150,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim1, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim2, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim3, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]),
          // Longer pause before next heartbeat
          Animated.delay(400),
        ]);
      };

      // Loop the heartbeat
      Animated.loop(createHeartbeat()).start();
    } else {
      // Reset to normal size when not beating
      scaleAnim1.setValue(1);
      scaleAnim2.setValue(1);
      scaleAnim3.setValue(1);
    }
  }, [isBeating, scaleAnim1, scaleAnim2, scaleAnim3]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outermost heart */}
      <Animated.View
        style={[
          styles.heart,
          styles.heartOuter,
          {
            transform: [{ scale: scaleAnim3 }],
            width: size,
            height: size,
          },
        ]}
      >
        <View style={styles.heartShape}>
          <View style={[styles.heartLeft, { width: size * 0.3, height: size * 0.3 }]} />
          <View style={[styles.heartRight, { width: size * 0.3, height: size * 0.3 }]} />
        </View>
      </Animated.View>

      {/* Middle heart */}
      <Animated.View
        style={[
          styles.heart,
          styles.heartMiddle,
          {
            transform: [{ scale: scaleAnim2 }],
            width: size * 0.75,
            height: size * 0.75,
          },
        ]}
      >
        <View style={styles.heartShape}>
          <View style={[styles.heartLeft, { width: size * 0.225, height: size * 0.225 }]} />
          <View style={[styles.heartRight, { width: size * 0.225, height: size * 0.225 }]} />
        </View>
      </Animated.View>

      {/* Innermost heart */}
      <Animated.View
        style={[
          styles.heart,
          styles.heartInner,
          {
            transform: [{ scale: scaleAnim1 }],
            width: size * 0.5,
            height: size * 0.5,
          },
        ]}
      >
        <View style={styles.heartShape}>
          <View style={[styles.heartLeft, { width: size * 0.15, height: size * 0.15 }]} />
          <View style={[styles.heartRight, { width: size * 0.15, height: size * 0.15 }]} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heart: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartOuter: {
    opacity: 0.4,
  },
  heartMiddle: {
    opacity: 0.6,
  },
  heartInner: {
    opacity: 1,
  },
  heartShape: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartLeft: {
    position: 'absolute',
    top: '15%',
    left: '20%',
    backgroundColor: colors.primary,
    borderRadius: 100,
    transform: [{ rotate: '-45deg' }],
  },
  heartRight: {
    position: 'absolute',
    top: '15%',
    right: '20%',
    backgroundColor: colors.primary,
    borderRadius: 100,
    transform: [{ rotate: '45deg' }],
  },
});
