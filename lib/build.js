// 编译去掉SOURCEMAP文件 减少体积 提高性能
process.env.GENERATE_SOURCEMAP = 'false';
// NODE_OPTIONS = "--max_old_space_size=36000";

const _dotenv = require('dotenv');
_dotenv.config({
    // 去掉map文件
    GENERATE_SOURCEMAP: false
});

// .config({ debug: process.env.DEBUG })