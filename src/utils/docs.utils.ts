export function applyDocs(decoratorMap: Record<string, MethodDecorator[]>) {
  return function (target: any) {
    for (const key in decoratorMap) {
      const methodDecorators = decoratorMap[key as keyof typeof decoratorMap];

      const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
      if (descriptor) {
        for (const decorator of methodDecorators) {
          decorator(target.prototype, key, descriptor);
        }
        Object.defineProperty(target.prototype, key, descriptor);
      }
    }
    return target;
  };
}
