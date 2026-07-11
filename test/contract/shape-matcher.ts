type ShapeDescriptor = Record<string, 'string' | 'number' | 'boolean' | 'object'>;

export function assertShape(actual: unknown, expected: ShapeDescriptor): void {
  expect(actual).toBeInstanceOf(Object);
  const actualObject = actual as Record<string, unknown>;

  expect(Object.keys(actualObject).sort()).toEqual(Object.keys(expected).sort());

  for (const [key, type] of Object.entries(expected)) {
    expect(typeof actualObject[key]).toBe(type);
  }
}
