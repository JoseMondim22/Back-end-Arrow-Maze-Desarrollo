import { UserMother } from '../../../mothers/user.mother';

describe('User', () => {
  it('should_keep_given_id_when_registering', () => {
    // Arrange & Act
    const user = UserMother.withId('111111111111');

    // Assert
    expect(user.getId().getValue()).toBe('111111111111');
    expect(user.getEmail().getValue()).toBe('user@example.com');
    expect(user.getUsername().getValue()).toBe('joe');
  });

  it('should_keep_given_id_when_reconstituting_from_persistence', () => {
    // Arrange & Act
    const user = UserMother.reconstitutedWithId('333333333333');

    // Assert
    expect(user.getId().getValue()).toBe('333333333333');
  });
});
