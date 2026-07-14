import { PositionFactory } from '../../../../../src/domain/level/factories/position.factory';
import { GridPosition } from '../../../../../src/domain/level/value-objects/grid-position';
import { GridPosition3D } from '../../../../../src/domain/level/value-objects/grid-position-3d';
import { InvalidGridPositionError, UnknownPositionTypeError } from '../../../../../src/domain/level/errors';

describe('PositionFactory', () => {
  it('should_create_a_grid_position_when_position_type_is_absent', () => {
    // Arrange & Act
    const position = PositionFactory.create({ row: 1, column: 2 });

    // Assert
    expect(position).toBeInstanceOf(GridPosition);
  });

  it('should_create_a_grid_position_when_position_type_is_grid', () => {
    // Arrange & Act
    const position = PositionFactory.create({ row: 1, column: 2, positionType: 'grid' });

    // Assert
    expect(position).toBeInstanceOf(GridPosition);
  });

  it('should_create_a_grid_position_3d_when_position_type_is_grid3d', () => {
    // Arrange & Act
    const position = PositionFactory.create({ row: 1, column: 2, layer: 3, positionType: 'grid3d' });

    // Assert
    expect(position).toBeInstanceOf(GridPosition3D);
    expect((position as GridPosition3D).getLayer()).toBe(3);
  });

  it('should_throw_invalid_grid_position_error_when_position_type_is_grid3d_and_layer_is_missing', () => {
    // Arrange & Act & Assert
    expect(() => PositionFactory.create({ row: 1, column: 2, positionType: 'grid3d' })).toThrow(
      InvalidGridPositionError,
    );
  });

  it('should_throw_unknown_position_type_error_when_position_type_is_not_recognized', () => {
    // Arrange & Act & Assert
    expect(() => PositionFactory.create({ row: 1, column: 2, positionType: 'circular' })).toThrow(
      UnknownPositionTypeError,
    );
  });

  it('should_throw_invalid_grid_position_error_when_layer_is_provided_without_grid3d_position_type', () => {
    // Arrange & Act & Assert
    expect(() => PositionFactory.create({ row: 1, column: 2, layer: 0 })).toThrow(InvalidGridPositionError);
  });
});
