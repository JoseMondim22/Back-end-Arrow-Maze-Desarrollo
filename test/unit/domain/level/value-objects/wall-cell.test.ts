import { WallCell } from '../../../../../src/domain/level/value-objects/wall-cell';
import { EmptyCell } from '../../../../../src/domain/level/value-objects/empty-cell';

describe('WallCell', () => {
  it('should_be_equal_when_compared_to_another_wall_cell', () => {
    // Arrange
    const first = WallCell.create();
    const second = WallCell.create();

    // Act & Assert
    expect(first.equals(second)).toBe(true);
  });

  it('should_not_be_equal_when_compared_to_a_different_cell_type', () => {
    // Arrange
    const wallCell = WallCell.create();
    const emptyCell = EmptyCell.create();

    // Act & Assert
    expect(wallCell.equals(emptyCell)).toBe(false);
  });
});
