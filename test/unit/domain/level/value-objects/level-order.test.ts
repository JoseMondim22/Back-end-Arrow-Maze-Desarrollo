import { LevelOrder } from '../../../../../src/domain/level/value-objects/level-order';
import { InvalidLevelOrderError } from '../../../../../src/domain/level/errors';

describe('LevelOrder', () => {
  it('should_create_when_value_is_a_positive_integer', () => {
    // Arrange
    const rawOrder = 3;

    // Act
    const order = LevelOrder.create(rawOrder);

    // Assert
    expect(order.getValue()).toBe(rawOrder);
  });

  it('should_throw_invalid_level_order_error_when_value_is_zero', () => {
    // Arrange & Act & Assert
    expect(() => LevelOrder.create(0)).toThrow(InvalidLevelOrderError);
  });

  it('should_throw_invalid_level_order_error_when_value_is_not_an_integer', () => {
    // Arrange & Act & Assert
    expect(() => LevelOrder.create(1.5)).toThrow(InvalidLevelOrderError);
  });

  it('should_be_equal_when_values_match', () => {
    // Arrange
    const first = LevelOrder.create(2);
    const second = LevelOrder.create(2);

    // Act & Assert
    expect(first.equals(second)).toBe(true);
  });
});
