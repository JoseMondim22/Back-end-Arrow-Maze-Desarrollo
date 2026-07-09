import { Edge } from '../../../../../src/domain/level/value-objects/edge';
import { NodeId } from '../../../../../src/domain/level/value-objects/node-id';

describe('Edge', () => {
  it('should_keep_given_from_and_to_node_ids_when_created', () => {
    // Arrange
    const from = NodeId.create('1');
    const to = NodeId.create('2');

    // Act
    const edge = Edge.create(from, to);

    // Assert
    expect(edge.getFrom().equals(from)).toBe(true);
    expect(edge.getTo().equals(to)).toBe(true);
  });
});
