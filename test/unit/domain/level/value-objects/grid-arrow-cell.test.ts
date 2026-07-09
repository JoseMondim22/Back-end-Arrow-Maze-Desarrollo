import { GridArrowCell } from '../../../../../src/domain/level/value-objects/grid-arrow-cell';
import { GridDirection } from '../../../../../src/domain/level/value-objects/grid-direction';
import { WallCell } from '../../../../../src/domain/level/value-objects/wall-cell';

describe('GridArrowCell', () => {
  it('should_keep_given_direction_when_created', () => {
    // Arrange
    const direction = GridDirection.create('up');

    // Act
    const cell = GridArrowCell.create(direction);

    // Assert
    expect(cell.getDirection().equals(direction)).toBe(true);
  });

  it('should_be_equal_when_directions_match', () => {
    // Arrange
    const first = GridArrowCell.create(GridDirection.create('left'));
    const second = GridArrowCell.create(GridDirection.create('left'));

    // Act & Assert
    expect(first.equals(second)).toBe(true);
  });

  it('should_not_be_equal_when_compared_to_a_different_cell_type', () => {
    // Arrange
    const arrowCell = GridArrowCell.create(GridDirection.create('left'));
    const wallCell = WallCell.create();

    // Act & Assert
    expect(arrowCell.equals(wallCell)).toBe(false);
  });
});
