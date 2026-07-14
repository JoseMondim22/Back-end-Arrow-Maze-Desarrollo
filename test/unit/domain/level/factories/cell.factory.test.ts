import { CellFactory } from '../../../../../src/domain/level/factories/cell.factory';
import { GridArrowCell } from '../../../../../src/domain/level/value-objects/grid-arrow-cell';
import { WallCell } from '../../../../../src/domain/level/value-objects/wall-cell';
import { EmptyCell } from '../../../../../src/domain/level/value-objects/empty-cell';
import { ExitCell } from '../../../../../src/domain/level/value-objects/exit-cell';
import { GridDirection } from '../../../../../src/domain/level/value-objects/grid-direction';
import { GridDirection3D } from '../../../../../src/domain/level/value-objects/grid-direction-3d';
import { UnknownCellTypeError, UnknownPositionTypeError } from '../../../../../src/domain/level/errors';

describe('CellFactory', () => {
  it('should_create_a_grid_arrow_cell_when_type_is_grid_arrow', () => {
    // Arrange & Act
    const cell = CellFactory.create({ type: 'grid_arrow', direction: 'up' });

    // Assert
    expect(cell).toBeInstanceOf(GridArrowCell);
    expect((cell as GridArrowCell).getDirection().equals(GridDirection.create('up'))).toBe(true);
  });

  it('should_create_a_grid_arrow_cell_with_2d_direction_when_position_type_is_absent', () => {
    // Arrange & Act
    const cell = CellFactory.create({ type: 'grid_arrow', direction: 'up' });

    // Assert
    expect((cell as GridArrowCell).getDirection()).toBeInstanceOf(GridDirection);
  });

  it('should_create_a_grid_arrow_cell_with_3d_direction_when_position_type_is_grid3d', () => {
    // Arrange & Act
    const cell = CellFactory.create({ type: 'grid_arrow', direction: 'forward', positionType: 'grid3d' });

    // Assert
    expect(cell).toBeInstanceOf(GridArrowCell);
    expect((cell as GridArrowCell).getDirection()).toBeInstanceOf(GridDirection3D);
    expect((cell as GridArrowCell).getDirection().equals(GridDirection3D.create('forward'))).toBe(true);
  });

  it('should_throw_unknown_position_type_error_when_position_type_is_not_recognized', () => {
    // Arrange & Act & Assert
    expect(() => CellFactory.create({ type: 'grid_arrow', direction: 'up', positionType: 'circular' })).toThrow(
      UnknownPositionTypeError,
    );
  });

  it('should_create_a_wall_cell_when_type_is_wall', () => {
    // Arrange & Act
    const cell = CellFactory.create({ type: 'wall' });

    // Assert
    expect(cell).toBeInstanceOf(WallCell);
  });

  it('should_create_an_empty_cell_when_type_is_empty', () => {
    // Arrange & Act
    const cell = CellFactory.create({ type: 'empty' });

    // Assert
    expect(cell).toBeInstanceOf(EmptyCell);
  });

  it('should_create_an_exit_cell_when_type_is_exit', () => {
    // Arrange & Act
    const cell = CellFactory.create({ type: 'exit' });

    // Assert
    expect(cell).toBeInstanceOf(ExitCell);
  });

  it('should_throw_unknown_cell_type_error_when_type_is_not_recognized', () => {
    // Arrange & Act & Assert
    expect(() => CellFactory.create({ type: 'lava' })).toThrow(UnknownCellTypeError);
  });
});
