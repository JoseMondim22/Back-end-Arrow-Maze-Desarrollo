import { LevelMother } from '../../../mothers/level.mother';

describe('Level', () => {
  it('should_keep_given_id_when_created', () => {
    // Arrange & Act
    const level = LevelMother.withId('1');

    // Assert
    expect(level.getId().getValue()).toBe('1');
    expect(level.getBoard().getNodes()).toHaveLength(1);
    expect(level.getRules().getMaxPossibleScore()).toBe(100);
    expect(level.getOrder().getValue()).toBe(1);
  });

  it('should_keep_given_id_when_reconstituting_from_persistence', () => {
    // Arrange & Act
    const level = LevelMother.reconstitutedWithId('2');

    // Assert
    expect(level.getId().getValue()).toBe('2');
  });

  it('should_consider_score_plausible_when_it_does_not_exceed_max_possible_score', () => {
    // Arrange
    const level = LevelMother.withMaxScore(100);

    // Act & Assert
    expect(level.isScorePlausible(100)).toBe(true);
  });

  it('should_consider_score_implausible_when_it_exceeds_max_possible_score', () => {
    // Arrange
    const level = LevelMother.withMaxScore(100);

    // Act & Assert
    expect(level.isScorePlausible(101)).toBe(false);
  });
});
