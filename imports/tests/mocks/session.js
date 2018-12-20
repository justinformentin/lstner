const keys = {};

export const Session = {
  set: jest.fn().mockImplementation((key, value) => (keys[key] = value)),
  get: jest.fn().mockImplementation(key => keys[key])
};
