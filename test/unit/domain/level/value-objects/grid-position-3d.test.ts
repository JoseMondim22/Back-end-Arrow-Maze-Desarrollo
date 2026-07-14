import { GridPosition3D } from '../../../../../src/domain/level/value-objects/grid-position-3d';
import { InvalidGridPositionError } from '../../../../../src/domain/level/errors';

describe('GridPosition3D', () => {
  it('should_create_when_row_column_and_layer_are_non_negative_integers', () => {
    // Arrange & Act
    const position = GridPosition3D.create(1, 2, 3);

    // Assert
    expect(position.getRow()).toBe(1);
    expect(position.getColumn()).toBe(2);
    expect(position.getLayer()).toBe(3);
  });

  it('should_throw_invalid_grid_position_error_when_row_is_negative', () => {
    // Arrange & Act & Assert
    expect(() => GridPosition3D.create(-1, 2, 0)).toThrow(InvalidGridPositionError);
  });

  it('should_throw_invalid_grid_position_error_when_column_is_negative', () => {
    // Arrange & Act & Assert
    expect(() => GridPosition3D.create(1, -2, 0)).toThrow(InvalidGridPositionError);
  });

  it('should_throw_invalid_grid_position_error_when_layer_is_negative', () => {
    // Arrange & Act & Assert
    expect(() => GridPosition3D.create(1, 2, -1)).toThrow(InvalidGridPositionError);
  });

  it('should_be_equal_when_row_column_and_layer_match', () => {
    // Arrange
    const first = GridPosition3D.create(0, 0, 0);
    const second = GridPosition3D.create(0, 0, 0);

    // Act & Assert
    expect(first.equals(second)).toBe(true);
  });

  it('should_not_be_equal_when_layer_differs', () => {
    // Arrange
    const first = GridPosition3D.create(0, 0, 0);
    const second = GridPosition3D.create(0, 0, 1);

    // Act & Assert
    expect(first.equals(second)).toBe(false);
  });
});
