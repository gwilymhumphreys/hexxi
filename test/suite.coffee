Queue = require 'queue-async'
path = require 'path'

DirectoryUtils = require './directory-utils'

process.env.NODE_ENV = 'test'

TESTS = DirectoryUtils.functionModules(path.resolve(path.join(__dirname, './unit')))

console.log "\nJobs: Running tests"
queue = new Queue(1)
for dir, test of TESTS
  do (test) -> queue.defer (callback) -> test({}, callback)

queue.await -> '\nJobs: Tests complete'
