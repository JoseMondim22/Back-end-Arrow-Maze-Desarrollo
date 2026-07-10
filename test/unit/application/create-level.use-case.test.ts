import { CreateLevelCommand } from '../../../src/application/commands/create-level.command';
import {
  DanglingEdgeError,
  MissingExitCellError,
  MultipleExitCellsError,
} from '../../../src/domain/level/errors';
import { CreateLevelTestAPI } from '../../testing-api/create-level.test-api';

describe('CreateLevelUseCase', () => {
  it('should_save_level_when_data_is_valid', async () => {
    // Arrange
    const api = new CreateLevelTestAPI();
    const command = new CreateLevelCommand(
      [{ id: '1', type: 'exit', row: 0, column: 0 }],
      [],
      60,
      20,
      100,
      1,
      1,
    );

    // Act
    await api.whenCreatingLevel(command);

    // Assert
    api.thenLevelShouldBeSavedWithOrder(1);
  });

  it('should_assign_generated_id_when_creating_level', async () => {
    // Arrange
    const api = new CreateLevelTestAPI();
    const command = new CreateLevelCommand(
      [{ id: '1', type: 'exit', row: 0, column: 0 }],
      [],
      60,
      20,
      100,
      1,
      1,
    );

    // Act
    await api.whenCreatingLevel(command);

    // Assert
    api.thenSavedLevelShouldHaveGeneratedId();
  });

  it('should_save_level_with_all_given_nodes', async () => {
    // Arrange
    const api = new CreateLevelTestAPI();
    const command = new CreateLevelCommand(
      [
        { id: '1', type: 'grid_arrow', row: 0, column: 0, direction: 'up' },
        { id: '2', type: 'exit', row: 0, column: 1 },
      ],
      [{ from: '1', to: '2' }],
      60,
      20,
      100,
      1,
      1,
    );

    // Act
    await api.whenCreatingLevel(command);

    // Assert
    api.thenSavedLevelShouldHaveNodeCount(2);
  });

  it('should_fail_when_board_has_no_exit_cell', async () => {
    // Arrange
    const api = new CreateLevelTestAPI();
    const command = new CreateLevelCommand(
      [{ id: '1', type: 'wall', row: 0, column: 0 }],
      [],
      60,
      20,
      100,
      1,
      1,
    );

    // Act
    await api.whenCreatingLevel(command);

    // Assert
    api.thenShouldFailWith(MissingExitCellError);
  });

  it('should_fail_when_board_has_multiple_exit_cells', async () => {
    // Arrange
    const api = new CreateLevelTestAPI();
    const command = new CreateLevelCommand(
      [
        { id: '1', type: 'exit', row: 0, column: 0 },
        { id: '2', type: 'exit', row: 0, column: 1 },
      ],
      [],
      60,
      20,
      100,
      1,
      1,
    );

    // Act
    await api.whenCreatingLevel(command);

    // Assert
    api.thenShouldFailWith(MultipleExitCellsError);
  });

  it('should_fail_when_edge_references_unknown_node', async () => {
    // Arrange
    const api = new CreateLevelTestAPI();
    const command = new CreateLevelCommand(
      [{ id: '1', type: 'exit', row: 0, column: 0 }],
      [{ from: '1', to: '2' }],
      60,
      20,
      100,
      1,
      1,
    );

    // Act
    await api.whenCreatingLevel(command);

    // Assert
    api.thenShouldFailWith(DanglingEdgeError);
  });

  it('should_not_save_level_when_board_is_invalid', async () => {
    // Arrange
    const api = new CreateLevelTestAPI();
    const command = new CreateLevelCommand(
      [{ id: '1', type: 'wall', row: 0, column: 0 }],
      [],
      60,
      20,
      100,
      1,
      1,
    );

    // Act
    await api.whenCreatingLevel(command);

    // Assert
    api.thenNoLevelShouldBeSaved();
  });
});
