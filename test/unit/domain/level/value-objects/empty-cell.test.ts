import { EmptyCell } from '../../../../../src/domain/level/value-objects/empty-cell';
import { WallCell } from '../../../../../src/domain/level/value-objects/wall-cell';

describe('EmptyCell', () => {
  it('should_be_equal_when_compared_to_another_empty_cell', () => {
    // Arrange
    const first = EmptyCell.create();
    const second = EmptyCell.create();

    // Act & Assert
    expect(first.equals(second)).toBe(true);
  });

  it('should_not_be_equal_when_compared_to_a_different_cell_type', () => {
    // Arrange
    const emptyCell = EmptyCell.create();
    const wallCell = WallCell.create();

    // Act & Assert
    expect(emptyCell.equals(wallCell)).toBe(false);
  });
});
