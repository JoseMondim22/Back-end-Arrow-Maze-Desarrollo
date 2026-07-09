import { ExitCell } from '../../../../../src/domain/level/value-objects/exit-cell';
import { WallCell } from '../../../../../src/domain/level/value-objects/wall-cell';

describe('ExitCell', () => {
  it('should_be_equal_when_compared_to_another_exit_cell', () => {
    // Arrange
    const first = ExitCell.create();
    const second = ExitCell.create();

    // Act & Assert
    expect(first.equals(second)).toBe(true);
  });

  it('should_not_be_equal_when_compared_to_a_different_cell_type', () => {
    // Arrange
    const exitCell = ExitCell.create();
    const wallCell = WallCell.create();

    // Act & Assert
    expect(exitCell.equals(wallCell)).toBe(false);
  });
});
