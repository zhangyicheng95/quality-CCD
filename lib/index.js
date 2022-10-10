#!/usr/bin/env node
'use strict';

const child_process = require('child_process');
// 编译配置文件
child_process.exec('tsc src/setupProxy.ts');