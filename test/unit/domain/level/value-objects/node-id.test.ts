import { NodeId } from '../../../../../src/domain/level/value-objects/node-id';
import { InvalidNodeIdError } from '../../../../../src/domain/level/errors';

describe('NodeId', () => {
  it('should_create_when_value_is_numeric_and_up_to_12_chars', () => {
    // Arrange
    const rawId = '1';

    // Act
    const nodeId = NodeId.create(rawId);

    // Assert
    expect(nodeId.getValue()).toBe(rawId);
  });

  it('should_throw_invalid_node_id_error_when_value_is_empty', () => {
    // Arrange & Act & Assert
    expect(() => NodeId.create('')).toThrow(InvalidNodeIdError);
  });

  it('should_throw_invalid_node_id_error_when_value_is_not_numeric', () => {
    // Arrange & Act & Assert
    expect(() => NodeId.create('n1')).toThrow(InvalidNodeIdError);
  });

  it('should_throw_invalid_node_id_error_when_value_exceeds_12_chars', () => {
    // Arrange & Act & Assert
    expect(() => NodeId.create('1234567890123')).toThrow(InvalidNodeIdError);
  });

  it('should_be_equal_when_values_match', () => {
    // Arrange
    const rawId = '2';
    const first = NodeId.create(rawId);
    const second = NodeId.create(rawId);

    // Act & Assert
    expect(first.equals(second)).toBe(true);
  });
});
