The `child_process` module provides the ability to spawn child processes in a manner that is similar, but not identical, to [popen(3)](http://man7.org/linux/man-pages/man3/popen.3.html). This capability is primarily provided by the [`child_process.spawn()`](https://nodejs.org/dist/latest-v8.x/docs/api/child_process.html#child_process_child_process_spawn_command_args_options) function:

child_process模块提供了以与popen（3）类似但不相同的方式产生子进程的能力。该功能主要由child_process.spawn（）函数提供：

```javascript
const { spawn } = require('child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

