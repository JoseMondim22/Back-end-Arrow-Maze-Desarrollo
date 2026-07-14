import { GridDirection3D } from '../../../../../src/domain/level/value-objects/grid-direction-3d';
import { InvalidGridDirectionError } from '../../../../../src/domain/level/errors';

describe('GridDirection3D', () => {
  it.each(['up', 'right', 'down', 'left', 'forward', 'backward'])(
    'should_create_when_value_is_%s',
    (value) => {
      // Arrange & Act
      const direction = GridDirection3D.create(value);

      // Assert
      expect(direction.getValue()).toBe(value);
    },
  );

  it('should_normalize_case_when_value_has_uppercase_letters', () => {
    // Arrange & Act
    const direction = GridDirection3D.create('FORWARD');

    // Assert
    expect(direction.getValue()).toBe('forward');
  });

  it('should_throw_invalid_grid_direction_error_when_value_is_unknown', () => {
    // Arrange & Act & Assert
    expect(() => GridDirection3D.create('diagonal')).toThrow(InvalidGridDirectionError);
  });

  it('should_be_equal_when_values_match', () => {
    // Arrange
    const first = GridDirection3D.create('forward');
    const second = GridDirection3D.create('forward');

    // Act & Assert
    expect(first.equals(second)).toBe(true);
  });
});
