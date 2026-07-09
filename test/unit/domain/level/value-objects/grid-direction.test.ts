import { GridDirection } from '../../../../../src/domain/level/value-objects/grid-direction';
import { InvalidGridDirectionError } from '../../../../../src/domain/level/errors';

describe('GridDirection', () => {
  it.each(['up', 'right', 'down', 'left'])(
    'should_create_when_value_is_%s',
    (value) => {
      // Arrange & Act
      const direction = GridDirection.create(value);

      // Assert
      expect(direction.getValue()).toBe(value);
    },
  );

  it('should_normalize_case_when_value_has_uppercase_letters', () => {
    // Arrange & Act
    const direction = GridDirection.create('UP');

    // Assert
    expect(direction.getValue()).toBe('up');
  });

  it('should_throw_invalid_grid_direction_error_when_value_is_unknown', () => {
    // Arrange & Act & Assert
    expect(() => GridDirection.create('diagonal')).toThrow(InvalidGridDirectionError);
  });

  it('should_be_equal_when_values_match', () => {
    // Arrange
    const first = GridDirection.create('up');
    const second = GridDirection.create('up');

    // Act & Assert
    expect(first.equals(second)).toBe(true);
  });
});
