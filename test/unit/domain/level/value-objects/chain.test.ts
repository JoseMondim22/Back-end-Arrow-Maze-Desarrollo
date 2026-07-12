import { Chain } from '../../../../../src/domain/level/value-objects/chain';
import { ChainId } from '../../../../../src/domain/level/value-objects/chain-id';
import { NodeId } from '../../../../../src/domain/level/value-objects/node-id';
import { InvalidChainIdError } from '../../../../../src/domain/level/errors';

describe('Chain', () => {
  it('should_expose_id_and_ordered_node_ids_when_created', () => {
    // Arrange
    const nodeIds = [NodeId.create('1'), NodeId.create('2')];

    // Act
    const chain = Chain.create(ChainId.create('c1'), nodeIds);

    // Assert
    expect(chain.getId().getValue()).toBe('c1');
    expect(chain.getNodeIds().map((id) => id.getValue())).toEqual(['1', '2']);
  });

  it('should_return_a_defensive_copy_of_node_ids', () => {
    // Arrange
    const chain = Chain.create(ChainId.create('c1'), [NodeId.create('1')]);

    // Act
    chain.getNodeIds().push(NodeId.create('2'));

    // Assert
    expect(chain.getNodeIds()).toHaveLength(1);
  });
});

describe('ChainId', () => {
  it('should_throw_invalid_chain_id_error_when_value_is_empty', () => {
    // Arrange & Act & Assert
    expect(() => ChainId.create('')).toThrow(InvalidChainIdError);
  });
});
