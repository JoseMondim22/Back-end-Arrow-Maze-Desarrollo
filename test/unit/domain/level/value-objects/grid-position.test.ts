import { GridPosition } from '../../../../../src/domain/level/value-objects/grid-position';
import { InvalidGridPositionError } from '../../../../../src/domain/level/errors';

describe('GridPosition', () => {
  it('should_create_when_row_and_column_are_non_negative_integers', () => {
    // Arrange & Act
    const position = GridPosition.create(1, 2);

    // Assert
    expect(position.getRow()).toBe(1);
    expect(position.getColumn()).toBe(2);
  });

  it('should_throw_invalid_grid_position_error_when_row_is_negative', () => {
    // Arrange & Act & Assert
    expect(() => GridPosition.create(-1, 2)).toThrow(InvalidGridPositionError);
  });

  it('should_throw_invalid_grid_position_error_when_column_is_negative', () => {
    // Arrange & Act & Assert
    expect(() => GridPosition.create(1, -2)).toThrow(InvalidGridPositionError);
  });

  it('should_be_equal_when_row_and_column_match', () => {
    // Arrange
    const first = GridPosition.create(0, 0);
    const second = GridPosition.create(0, 0);

    // Act & Assert
    expect(first.equals(second)).toBe(true);
  });

  it('should_not_be_equal_when_row_or_column_differ', () => {
    // Arrange
    const first = GridPosition.create(0, 0);
    const second = GridPosition.create(0, 1);

    // Act & Assert
    expect(first.equals(second)).toBe(false);
  });
});
