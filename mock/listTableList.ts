import { Request, Response } from 'express';

const getProjectsList = (req: Request, res: Response) => {
  res.json({
    code: 'SUCCESS',
    msg: '',
    data: [
      {
        id: 'e1fec01',
        name: '20230112',
        description: '分动箱涂胶',
        plugin_path: '/opt/ubvision/tujiao/plugins',
        zoom: 0.4200913242009132,
        graphLock: false,
        position: {
          x: 967.2173913043479,
          y: -609.9999999999999,
        },
        flowData: {
          groups: [
            {
              position: {
                x: 310,
                y: 580,
              },
              size: {
                width: 1720,
                height: 280,
              },
              attrs: {
                body: {
                  fill: '#2E394D',
                },
                buttonSign: {
                  d: 'M 2 5 8 5',
                },
                label: {
                  text: 'group_6a56067b',
                },
              },
              id: 'group_6a56067b',
              shape: 'dag-group',
              customId: 'group_6a56067b',
              childrenList: ['3e41e3d3-2ef4-44fc-9771-d352e634dfdf'],
              zIndex: 0,
              children: ['3e41e3d3-2ef4-44fc-9771-d352e634dfdf'],
              originPosition: {
                x: 310,
                y: 580,
              },
              originSize: {
                width: 1720,
                height: 280,
              },
            },
            {
              position: {
                x: -340,
                y: 1100,
              },
              size: {
                width: 440,
                height: 1120,
              },
              attrs: {
                body: {
                  fill: '#2E394D',
                },
                buttonSign: {
                  d: 'M 2 5 8 5',
                },
                label: {
                  text: 'group_e0278e38',
                },
              },
              id: 'group_e0278e38',
              shape: 'dag-group',
              customId: 'group_e0278e38',
              childrenList: [
                'b78ac9ce-d8f4-4e76-84eb-f38cf12a992a',
                'a1d8d2a3-3c96-4862-904e-a874bef76a57',
                'b5fef33b-ede1-4d8a-888c-2bbfce294b98',
              ],
              zIndex: 0,
              children: [
                'b78ac9ce-d8f4-4e76-84eb-f38cf12a992a',
                'a1d8d2a3-3c96-4862-904e-a874bef76a57',
                'b5fef33b-ede1-4d8a-888c-2bbfce294b98',
              ],
              originPosition: {
                x: -340,
                y: 1100,
              },
              originSize: {
                width: 440,
                height: 1100,
              },
            },
            {
              position: {
                x: 320,
                y: 1020,
              },
              size: {
                width: 1770,
                height: 1810,
              },
              attrs: {
                body: {
                  fill: '#2E394D',
                },
                buttonSign: {
                  d: 'M 2 5 8 5',
                },
                label: {
                  text: 'group_490b7b77',
                },
              },
              id: 'group_490b7b77',
              shape: 'dag-group',
              customId: 'group_490b7b77',
              childrenList: [
                'c98381bf-8e21-443b-b241-ee8a07d11b7b',
                '00798d3e-b188-4dec-a9bb-094552db721b',
                '8989a55c-1f87-404a-8135-58dab5225829',
                'b4f890bc-3254-4e03-a4bb-7e16b8d5534d',
                '45e063e4-8d3e-4e10-a1cd-48be2f78e97a',
                '56284350-1bc5-465f-b7d4-2c7fbe94097d',
                '1f90147b-c49c-4884-803f-1c97f9824655',
                'dc4e22e5-a1fe-4d99-9f2b-01367e813b1b',
              ],
              zIndex: 0,
              children: [
                'c98381bf-8e21-443b-b241-ee8a07d11b7b',
                '00798d3e-b188-4dec-a9bb-094552db721b',
                '8989a55c-1f87-404a-8135-58dab5225829',
                'b4f890bc-3254-4e03-a4bb-7e16b8d5534d',
                '45e063e4-8d3e-4e10-a1cd-48be2f78e97a',
                '56284350-1bc5-465f-b7d4-2c7fbe94097d',
                '1f90147b-c49c-4884-803f-1c97f9824655',
                'dc4e22e5-a1fe-4d99-9f2b-01367e813b1b',
              ],
              originPosition: {
                x: 320,
                y: 1020,
              },
              originSize: {
                width: 1770,
                height: 1810,
              },
            },
          ],
          nodes: [
            {
              name: 'LogAnalyzer',
              alias: '日志分析Analyzer',
              version: '2.0.0',
              category: 'Callback',
              description: '用于ubv运行日志分析，目前仅支持耗时分析，后续版本将加入异常分析等功能',
              author: 'liwen',
              config: {
                module: 'B__LogAnalyzer',
                executor: 'LogAnalyzer',
                initParams: {
                  log_file: {
                    name: 'log_file',
                    alias: '日志文件',
                    orderId: 0,
                    require: true,
                    default: '',
                    type: 'File',
                    widget: {
                      type: 'File',
                      id: 'log_file',
                      suffix: ['log'],
                    },
                  },
                  start_time: {
                    name: 'start_time',
                    alias: '开始时间',
                    orderId: 1,
                    require: false,
                    default: 0,
                    value: 0,
                    type: 'int',
                    widget: {
                      type: 'DatePicker',
                    },
                  },
                  end_time: {
                    name: 'end_time',
                    alias: '结束时间',
                    orderId: 2,
                    require: false,
                    default: 1691027321043,
                    value: 1691027321043,
                    type: 'int',
                    widget: {
                      type: 'DatePicker',
                    },
                  },
                },
                execParams: {
                  log_file: {
                    name: 'log_file',
                    alias: '日志文件',
                    orderId: 0,
                    require: true,
                    default: '',
                    type: 'File',
                    widget: {
                      type: 'File',
                      id: 'log_file',
                      suffix: ['log'],
                    },
                  },
                  start_time: {
                    name: 'start_time',
                    alias: '开始时间',
                    orderId: 1,
                    require: false,
                    default: 0,
                    value: 0,
                    type: 'int',
                    widget: {
                      type: 'DatePicker',
                    },
                  },
                  end_time: {
                    name: 'end_time',
                    alias: '结束时间',
                    orderId: 2,
                    require: false,
                    default: 1691027321043,
                    value: 1691027321043,
                    type: 'int',
                    widget: {
                      type: 'DatePicker',
                    },
                  },
                },
                input: {
                  cond: {
                    type: 'dict',
                    require: true,
                    alias: '执行信息',
                  },
                },
                output: {
                  data: {
                    type: 'list',
                    alias: 'data',
                  },
                  percent: {
                    type: 'list',
                    alias: 'percent',
                  },
                  trend_data: {
                    type: 'list',
                    alias: '趋势数据',
                  },
                },
                group: [],
              },
              buildIn: false,
            },
            {
              name: 'ImageStorge',
              version: '0.0.2',
              category: 'DS',
              description: 'This is a DataStorage plugin',
              author: 'liwen',
              config: {
                module: 'DS__A__ImageStorge',
                executor: 'ImageStorge',
                initParams: {
                  store_dir: {
                    name: 'store_dir',
                    alias: '存图目录',
                    require: true,
                    onHidden: true,
                    default: '/tmp/ubvision',
                    value: '/data/pangu-fs/track-inspect',
                    type: 'Dir',
                    description: '选择一个存图目录',
                    widget: {
                      type: 'Dir',
                    },
                  },
                  target_format: {
                    name: 'target_format',
                    alias: '存图格式',
                    require: true,
                    default: 'jpg',
                    value: '.jpg',
                    type: 'List[string]',
                    widget: {
                      type: 'Radio',
                      options: ['.jpg', '.png', '.bmp'],
                    },
                  },
                },
                input: {
                  src_img: {
                    type: 'numpy.ndarray',
                    require: true,
                    alias: 'src_img',
                  },
                  category: {
                    type: 'string',
                    require: false,
                    alias: 'category',
                  },
                  img_name: {
                    type: 'string',
                    require: false,
                    alias: 'img_name',
                  },
                },
                output: {
                  status: {
                    type: 'bool',
                    alias: 'status',
                  },
                  category: {
                    type: 'string',
                    alias: 'category',
                  },
                  store_path: {
                    type: 'string',
                    alias: 'store_path',
                  },
                },
              },
              alias: '图片存储器ImgStorge',
              buildIn: false,
              useGpu: false,
              id: '45e063e4-8d3e-4e10-a1cd-48be2f78e97a',
              _id: 'SNF8MEF6cMipAYTE',
              createdAt: '2022-06-21T10:15:17.282Z',
              updatedAt: '2022-06-21T10:17:15.705Z',
              ifShow: true,
              customId: 'node_d732fd33',
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                },
                items: [
                  {
                    customId: 'port_1f452085',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'src_img',
                      type: 'numpy.ndarray',
                      require: true,
                      alias: 'src_img',
                    },
                    color: '#1acccf',
                    id: '71cb731c-4648-41d6-933a-946f2a0db521',
                  },
                  {
                    customId: 'port_ac4beda0',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'category',
                      type: 'string',
                      require: false,
                      alias: 'category',
                    },
                    color: '#165b5c',
                    id: 'e5d20ecc-b2dc-4d2f-a7b4-bf0ecc1bcaa6',
                  },
                  {
                    customId: 'port_b1ee47eb',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'img_name',
                      type: 'string',
                      require: false,
                      alias: 'img_name',
                    },
                    color: '#165b5c',
                    id: 'e7e1dabe-8ba7-4c39-a787-f0fbbcd4cfba',
                  },
                  {
                    customId: 'port_b86c9517',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'status',
                      type: 'bool',
                      alias: 'status',
                    },
                    color: '#7d573a',
                    id: 'f409838a-abbb-4f7e-8e14-98432257447a',
                  },
                  {
                    customId: 'port_1a110c28',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'category',
                      type: 'string',
                      alias: 'category',
                    },
                    color: '#165b5c',
                    id: 'd87d04e9-331f-4334-922d-6c826211a848',
                  },
                  {
                    customId: 'port_508b1d0d',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'store_path',
                      type: 'string',
                      alias: 'store_path',
                    },
                    color: '#165b5c',
                    id: '5c66b076-ef20-4c1e-8c41-683c8ba170b2',
                  },
                ],
              },
              position: {
                x: 1060.0000000000011,
                y: 2000.0000000000027,
              },
              dropDownCheckBox: ['result'],
              size: {
                width: 480,
                height: 370,
              },
              parent: 'group_490b7b77',
            },
            {
              name: 'ImageStorge.json',
              version: '0.0.2',
              category: 'DS',
              description: 'This is a DataStorage plugin',
              author: 'liwen',
              config: {
                module: 'DS__A__ImageStorge',
                executor: 'ImageStorge',
                initParams: {
                  store_dir: {
                    name: 'store_dir',
                    alias: '存图目录',
                    require: true,
                    onHidden: true,
                    default: '/tmp/ubvision',
                    value: '/data/simulate/images',
                    type: 'Dir',
                    description: '选择一个存图目录',
                    widget: {
                      type: 'Dir',
                    },
                  },
                  target_format: {
                    name: 'target_format',
                    alias: '存图格式',
                    require: true,
                    default: 'jpg',
                    value: '.jpg',
                    type: 'List[string]',
                    widget: {
                      type: 'Radio',
                      options: ['.jpg', '.png', '.bmp'],
                    },
                  },
                },
                input: {
                  src_img: {
                    type: 'numpy.ndarray',
                    require: true,
                    alias: 'src_img',
                  },
                  category: {
                    type: 'string',
                    require: false,
                    alias: 'category',
                  },
                  img_name: {
                    type: 'string',
                    require: false,
                    alias: 'img_name',
                  },
                },
                output: {
                  status: {
                    type: 'bool',
                    alias: 'status',
                  },
                  category: {
                    type: 'string',
                    alias: 'category',
                  },
                  store_path: {
                    type: 'string',
                    alias: 'store_path',
                  },
                },
                group: [],
              },
              alias: '图片存储器ImgStorge.json',
              buildIn: false,
              useGpu: false,
              id: '56284350-1bc5-465f-b7d4-2c7fbe94097d',
              _id: 'SNF8MEF6cMipAYTE',
              createdAt: '2022-06-21T10:15:17.282Z',
              updatedAt: '2022-07-13T11:02:57.716Z',
              ifShow: true,
              customId: 'node_5f987d1b',
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                },
                items: [
                  {
                    customId: 'port_b3a9431b',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'src_img',
                      type: 'numpy.ndarray',
                      require: true,
                      alias: 'src_img',
                    },
                    color: '#1acccf',
                    id: '7c77e391-3961-4bbb-b009-a347149b449e',
                  },
                  {
                    customId: 'port_264baf3a',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'category',
                      type: 'string',
                      require: false,
                      alias: 'category',
                    },
                    color: '#165b5c',
                    id: 'c74b7ffb-9cab-4583-92ec-9700ce552318',
                  },
                  {
                    customId: 'port_0ddb2da7',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'img_name',
                      type: 'string',
                      require: false,
                      alias: 'img_name',
                    },
                    color: '#165b5c',
                    id: '9c65211b-8867-4cb5-8f39-8a21cee512ce',
                  },
                  {
                    customId: 'port_4f452295',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'status',
                      type: 'bool',
                      alias: 'status',
                    },
                    color: '#7d573a',
                    id: '5bdac4c1-3403-47c9-b7a4-7e5fb789559b',
                  },
                  {
                    customId: 'port_a20d197c',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'category',
                      type: 'string',
                      alias: 'category',
                    },
                    color: '#165b5c',
                    id: '28eae3a6-f1d8-4e16-88c9-6e385cac052f',
                  },
                  {
                    customId: 'port_854a6544',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'store_path',
                      type: 'string',
                      alias: 'store_path',
                    },
                    color: '#165b5c',
                    id: '14306f65-e705-4ca7-8769-cc093726a35c',
                  },
                ],
              },
              position: {
                x: 830.0000000000011,
                y: 1370.0000000000027,
              },
              size: {
                width: 444,
                height: 130,
              },
              dropDownCheckBox: ['result'],
              parent: 'group_490b7b77',
            },
            {
              name: 'Responser.json',
              version: '0.0.1',
              category: 'COMM',
              description: 'This is COMM Responser',
              author: 'lw-Sany',
              repository: 'https://github.com/UBV/ResultParser',
              bugs: 'https://github.com/UBV/ResultParser/issues',
              config: {
                module: 'COMM__A__Responser',
                executor: 'Responser',
                initParams: {
                  respond_to: {
                    name: 'respond_to',
                    alias: 'respond_to',
                    require: false,
                    type: 'string',
                    widget: {
                      type: 'Input',
                    },
                    value: '1fbf97c8-d887-43a5-8f2c-ed198e098b8b',
                  },
                },
                input: {
                  response: {
                    type: 'string',
                    require: true,
                    alias: 'response',
                  },
                },
                output: {},
              },
              alias: 'TCP-Responser.json',
              buildIn: false,
              useGpu: false,
              codeEditor: false,
              id: 'b4f890bc-3254-4e03-a4bb-7e16b8d5534d',
              _id: 'IIPdi27QjBzC76Ag',
              createdAt: '2022-06-05T15:14:02.102Z',
              updatedAt: '2022-07-13T11:03:30.387Z',
              ifShow: true,
              customId: 'node_bf76a6ee',
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                },
                items: [
                  {
                    customId: 'port_7987924e',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'response',
                      type: 'string',
                      require: true,
                      alias: 'response',
                    },
                    color: '#165b5c',
                    id: 'b6e929c7-606a-477d-9de1-9c5751936aca',
                  },
                ],
              },
              position: {
                x: 540.0000000000011,
                y: 2280.0000000000027,
              },
              size: {
                width: 300,
                height: 130,
              },
              dropDownCheckBox: [],
              parent: 'group_490b7b77',
            },
            {
              name: 'Glue_Trigger_Parser',
              version: '1.0.0',
              category: 'TOOL',
              description: 'TOOL__C__Glue_Trigger_Parser',
              author: 'sf-Sany',
              config: {
                module: 'TOOL__C__Glue_Trigger_Parser',
                executor: 'parse',
                initParams: {},
                input: {
                  origin_str: {
                    type: 'string',
                    require: true,
                    alias: 'origin_str',
                  },
                },
                output: {
                  camera: {
                    type: 'string',
                    alias: 'camera',
                  },
                  heart: {
                    type: 'string',
                    alias: 'heart',
                  },
                },
                group: [],
              },
              updatedAt: '2022-07-13T13:14:32.108Z',
              id: '3e41e3d3-2ef4-44fc-9771-d352e634dfdf',
              _id: 'cONUuPsSLoL8Rx5F',
              createdAt: '2022-07-13T13:14:24.753Z',
              alias: 'Glue_Trigger_Parser',
              buildIn: false,
              useGpu: false,
              ifShow: true,
              customId: 'node_d2946b47',
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                },
                items: [
                  {
                    customId: 'port_57fac917',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'origin_str',
                      type: 'string',
                      require: true,
                      alias: 'origin_str',
                    },
                    color: '#165b5c',
                    id: '627134a1-328f-4aa2-8125-efef9f5b23ec',
                  },
                  {
                    customId: 'port_b8f22edb',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'camera',
                      type: 'string',
                      alias: 'camera',
                    },
                    color: '#165b5c',
                    id: 'c2aeed53-807a-49ea-b265-6f0f206064d6',
                  },
                  {
                    customId: 'port_0c5a998c',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'heart',
                      type: 'string',
                      alias: 'heart',
                    },
                    color: '#165b5c',
                    id: '8852db72-a768-43d3-b57d-be7443a0202b',
                  },
                ],
              },
              position: {
                x: 1380,
                y: 650.0000000000003,
              },
              size: {
                width: 300,
                height: 130,
              },
              dropDownCheckBox: [],
              parent: 'group_6a56067b',
            },
            {
              alias: 'AIEngine',
              name: 'AIEngine',
              description:
                'This is an ai engine plugin for industrial visual quality inspection\n2022.7.1',
              version: '0.1.0',
              buildIn: false,
              useGpu: true,
              category: 'CV',
              config: {
                module: 'CV__B__AIEngine',
                executor: 'AIEngine',
                initParams: {
                  config_path: {
                    name: 'config_path',
                    alias: 'config_path',
                    require: false,
                    type: 'File',
                    widget: {
                      type: 'File',
                      suffix: [
                        '.jpg/.jpeg',
                        '.png',
                        '.svg',
                        '.pdf',
                        '.pt',
                        '.py',
                        '.doc/.docx',
                        '.csv',
                        '.bmp',
                        '.json',
                        'all',
                      ],
                    },
                    value:
                      '/opt/ubvision/tujiao/resources/configs/seg_swin_transformer_st_tujiao.json',
                  },
                  model_path: {
                    name: 'model_path',
                    alias: 'model_path',
                    require: false,
                    type: 'File',
                    widget: {
                      type: 'File',
                      suffix: [
                        '.jpg/.jpeg',
                        '.png',
                        '.svg',
                        '.pdf',
                        '.pt',
                        '.py',
                        '.doc/.docx',
                        '.csv',
                        '.bmp',
                        '.json',
                        'all',
                      ],
                    },
                    value:
                      '/opt/ubvision/tujiao/resources/models/iter_44000_w1024xh1024_sim_fp32.engine',
                  },
                },
                input: {
                  srcImg: {
                    type: 'numpy.ndarray',
                    require: true,
                    alias: 'srcImg',
                  },
                },
                output: {
                  class_name: {
                    type: 'list',
                    alias: 'class_name',
                  },
                  masks: {
                    type: 'numpy.ndarray',
                    alias: 'masks',
                  },
                  shapes: {
                    type: 'dict',
                    alias: 'shapes',
                  },
                  status: {
                    type: 'bool',
                    alias: 'status',
                  },
                },
                group: [],
              },
              author: 'zwt-Sany',
              repository: 'https://github.com/QIVG/AlgorithmPluginDemo',
              bugs: 'https://github.com/QIVG/AlgorithmPluginDemo/issues',
              _id: 'Ug3bhG8x9kYJHpGM',
              createdAt: '2022-06-17T13:08:34.434Z',
              updatedAt: '2022-07-14T18:56:31.404Z',
              id: '1f90147b-c49c-4884-803f-1c97f9824655',
              ifShow: true,
              customId: 'node_84079990',
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                },
                items: [
                  {
                    customId: 'port_c79f6953',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'srcImg',
                      type: 'numpy.ndarray',
                      require: true,
                      alias: 'srcImg',
                    },
                    color: '#1acccf',
                    id: '32f85b78-82b7-4bd8-b2c9-43a3a5a7903f',
                  },
                  {
                    customId: 'port_e9d93c82',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'class_name',
                      type: 'list',
                      alias: 'class_name',
                    },
                    color: '#694256',
                    id: 'ffde9a57-9e5b-43a2-aeef-47e4f0fb0c8e',
                  },
                  {
                    customId: 'port_5d4da216',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'masks',
                      type: 'numpy.ndarray',
                      alias: 'masks',
                    },
                    color: '#1acccf',
                    id: '3419b89d-70be-479c-9877-75ce3bcfdf98',
                  },
                  {
                    customId: 'port_7d268669',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'shapes',
                      type: 'dict',
                      alias: 'shapes',
                    },
                    color: '#425e7e',
                    id: 'a9186b9f-850a-4a0b-8eb2-aa9ad5ee9c6d',
                  },
                  {
                    customId: 'port_369b74fd',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'status',
                      type: 'bool',
                      alias: 'status',
                    },
                    color: '#7d573a',
                    id: 'd6bdeada-adea-41de-8f90-426e5c945318',
                  },
                ],
              },
              position: {
                x: 1380.0000000000011,
                y: 1350.0000000000027,
              },
              size: {
                width: 592,
                height: 130,
              },
              dropDownCheckBox: [],
              parent: 'group_490b7b77',
            },
            {
              alias: 'GalaxyCamera',
              name: 'GalaxyCamera',
              description: 'GalaxyCamera',
              version: '0.1.0',
              buildIn: false,
              useGpu: false,
              category: 'CAPTURE',
              config: {
                module: 'CAPTURE__B__GalaxyCamera',
                executor: 'Camera',
                initParams: {
                  camera_name: {
                    name: 'camera_name',
                    alias: 'camera_name',
                    require: false,
                    default: 'DefaultCam',
                    value: 'DefaultCam',
                    type: 'string',
                    widget: {
                      type: 'Input',
                    },
                  },
                  serial_number: {
                    name: 'serial_number',
                    alias: 'serial_number',
                    require: true,
                    default: ' ',
                    value: 'LT0210051918',
                    type: 'string',
                    widget: {
                      type: 'Input',
                    },
                  },
                  exposure_time: {
                    name: 'exposure_time',
                    alias: 'exposure_time',
                    require: true,
                    default: 5000,
                    value: 1500,
                    type: 'int',
                    widget: {
                      type: 'InputNumber',
                      max: 100000,
                      min: 500,
                      step: 100,
                      precision: 0,
                    },
                  },
                  data_format: {
                    name: 'data_format',
                    alias: 'data_format',
                    require: false,
                    default: 'RGB',
                    value: 'RGB',
                    type: 'List[string]',
                    widget: {
                      type: 'Radio',
                      options: ['RGB', 'GRAY', 'RAW'],
                    },
                  },
                  interval_time: {
                    name: 'interval_time',
                    alias: 'interval_time',
                    require: true,
                    default: 0,
                    type: 'float',
                    widget: {
                      type: 'InputNumber',
                      max: 5,
                      min: 0,
                      step: 0.05,
                      precision: 2,
                    },
                    value: 0.1,
                  },
                  width: {
                    type: 'float',
                    default: 2048,
                    require: false,
                    widget: {
                      type: 'InputNumber',
                      max: 6000,
                      min: 100,
                      step: 1,
                      precision: 1,
                    },
                    value: 5496,
                    alias: 'width',
                    name: 'width',
                  },
                  height: {
                    type: 'float',
                    default: 2048,
                    require: false,
                    widget: {
                      type: 'InputNumber',
                      max: 6000,
                      min: 100,
                      step: 1,
                      precision: 1,
                    },
                    value: 3672,
                    alias: 'height',
                    name: 'height',
                  },
                  DEV_MAPPER: {
                    type: 'str',
                    default: '/dev/bus/usb',
                    value: '/dev/bus/usb',
                    require: true,
                    widget: {
                      type: 'Input',
                    },
                    alias: 'DEV_MAPPER',
                    name: 'DEV_MAPPER',
                  },
                  NETWORKMODE: {
                    default: 'host',
                    require: true,
                    value: 'host',
                    type: 'List[string]',
                    widget: {
                      type: 'Radio',
                      options: ['host', 'bridge'],
                    },
                    alias: 'NETWORKMODE',
                    name: 'NETWORKMODE',
                  },
                  Gain: {
                    name: 'Gain',
                    alias: 'Gain',
                    require: true,
                    default: 10,
                    value: 10,
                    type: 'float',
                    widget: {
                      type: 'Slider',
                      max: 20,
                      min: 0.1,
                      step: 0.1,
                    },
                  },
                },
                input: {
                  signal: {
                    type: 'string',
                    require: true,
                    alias: 'signal',
                  },
                },
                output: {
                  frame: {
                    type: 'numpy.ndarray',
                    alias: 'frame',
                  },
                  category: {
                    type: 'string',
                    alias: 'category',
                  },
                  status: {
                    type: 'bool',
                    alias: 'status',
                  },
                },
                group: [
                  {
                    id: '76a2eea9',
                    open: false,
                    children: ['NETWORKMODE', 'DEV_MAPPER'],
                    name: 'Advanced Options',
                  },
                ],
              },
              author: 'liwen',
              _id: 'UEpwqYTvke6un0Rs',
              createdAt: '2022-07-10T03:06:07.682Z',
              updatedAt: '2022-07-15T07:45:51.867Z',
              id: 'c98381bf-8e21-443b-b241-ee8a07d11b7b',
              ifShow: true,
              customId: 'node_0bb7ada6',
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                },
                items: [
                  {
                    customId: 'port_b776d46c',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'signal',
                      type: 'string',
                      require: true,
                      alias: 'signal',
                    },
                    color: '#165b5c',
                    id: '8c3b5c46-5934-496d-ac5f-d8b1ca403188',
                  },
                  {
                    customId: 'port_42c40766',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'frame',
                      type: 'numpy.ndarray',
                      alias: 'frame',
                    },
                    color: '#1acccf',
                    id: '7961fb07-7eec-443e-91c5-6a3177732566',
                  },
                  {
                    customId: 'port_a7b8fbcc',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'category',
                      type: 'string',
                      alias: 'category',
                    },
                    color: '#165b5c',
                    id: '51510414-8a0c-49f6-a6b0-3eec528bed65',
                  },
                  {
                    customId: 'port_ddc16065',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'status',
                      type: 'bool',
                      alias: 'status',
                    },
                    color: '#7d573a',
                    id: '7837188d-ec7e-440a-b1d1-396334560acf',
                  },
                ],
              },
              position: {
                x: 810.0000000000011,
                y: 1060.0000000000027,
              },
              size: {
                width: 444,
                height: 130,
              },
              dropDownCheckBox: [],
              parent: 'group_490b7b77',
            },
            {
              alias: '服务TCPServer',
              name: 'TcpServer',
              description:
                'TCP服务插件，跟监听指定端口的请求，并根据"默认异常响应信息"和 "异常中断响应表" 进行响应',
              version: '0.0.2',
              buildIn: false,
              useGpu: false,
              category: 'SERV',
              config: {
                module: 'SERV__A__TcpServer',
                executor: 'TcpServer',
                initParams: {
                  port: {
                    name: 'port',
                    alias: 'port',
                    require: true,
                    default: 2000,
                    value: 5546,
                    type: 'int',
                    description: '监听端口',
                    widget: {
                      type: 'InputNumber',
                      max: 65535,
                      min: 1000,
                      step: 1,
                      precision: 0,
                    },
                  },
                  default_res_msg: {
                    name: 'default_res_msg',
                    alias: '默认异常响应信息',
                    require: true,
                    default: 'ERROR',
                    value: 'ERROR',
                    type: 'string',
                    description: '默认异常响应信息',
                    widget: {
                      type: 'Input',
                    },
                  },
                  response_template: {
                    name: 'response_template',
                    alias: '异常中断响应表',
                    require: false,
                    default: '{}',
                    type: 'string',
                    widget: {
                      type: 'codeEditor',
                    },
                    value: '{}',
                  },
                },
                input: {},
                output: {
                  message: {
                    type: 'string',
                    alias: 'message',
                  },
                },
                group: [],
              },
              author: 'liwen',
              repository: 'https://github.com/UBV/TcpServer',
              bugs: 'https://github.com/UBV/TcpServer/issues',
              id: 'a1d8d2a3-3c96-4862-904e-a874bef76a57',
              _id: '1DBwzaY2tR0lAQ2J',
              createdAt: '2022-06-21T10:16:06.395Z',
              updatedAt: '2022-07-14T18:56:31.402Z',
              ifShow: true,
              customId: 'node_72eca6e4',
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                },
                items: [
                  {
                    customId: 'port_82c0c610',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'message',
                      type: 'string',
                      alias: 'message',
                    },
                    color: '#165b5c',
                    id: '9591d6e0-64ca-4d8c-b42b-29f439ac3e0f',
                  },
                ],
              },
              position: {
                x: -240,
                y: 1160,
              },
              size: {
                width: 300,
                height: 130,
              },
              dropDownCheckBox: [],
              parent: 'group_e0278e38',
            },
            {
              alias: 'Glue_Trigger_Parser',
              name: 'Glue_Trigger_Parser',
              description: 'TOOL__C__Glue_Trigger_Parser',
              version: '1.0.0',
              buildIn: false,
              useGpu: false,
              category: 'TOOL',
              config: {
                module: 'TOOL__C__Glue_Trigger_Parser',
                executor: 'parse',
                initParams: {},
                input: {
                  origin_str: {
                    type: 'string',
                    require: true,
                    alias: 'origin_str',
                  },
                },
                output: {
                  camera: {
                    type: 'string',
                    alias: 'camera',
                  },
                  heart: {
                    type: 'string',
                    alias: 'heart',
                  },
                },
                group: [],
              },
              author: 'sf-Sany',
              updatedAt: '2022-07-19T11:58:18.297Z',
              id: 'b5fef33b-ede1-4d8a-888c-2bbfce294b98',
              _id: 'ywHaV9aVLeaakgcn',
              createdAt: '2022-07-19T11:57:49.555Z',
              ifShow: true,
              customId: 'node_1f183bca',
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                },
                items: [
                  {
                    customId: 'port_ec6ea7e6',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'origin_str',
                      type: 'string',
                      require: true,
                      alias: 'origin_str',
                    },
                    color: '#165b5c',
                    id: '88ffbb5b-d26a-42d3-9f91-337e0436d92a',
                  },
                  {
                    customId: 'port_90b1f6d0',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'camera',
                      type: 'string',
                      alias: 'camera',
                    },
                    color: '#165b5c',
                    id: 'fbcc3c56-0d77-4a49-adf0-2dbf14f03400',
                  },
                  {
                    customId: 'port_4a8425fd',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'heart',
                      type: 'string',
                      alias: 'heart',
                    },
                    color: '#165b5c',
                    id: '058e4bdb-167e-48f4-9188-3273baff14e4',
                  },
                ],
              },
              position: {
                x: -250,
                y: 1600,
              },
              size: {
                width: 300,
                height: 130,
              },
              dropDownCheckBox: [],
              parent: 'group_e0278e38',
            },
            {
              alias: 'TCP-Responser',
              name: 'Responser',
              description: 'This is COMM Responser',
              version: '0.0.1',
              buildIn: false,
              useGpu: false,
              category: 'COMM',
              config: {
                module: 'COMM__A__Responser',
                executor: 'Responser',
                initParams: {
                  respond_to: {
                    name: 'respond_to',
                    alias: 'respond_to',
                    require: false,
                    type: 'string',
                    widget: {
                      type: 'Input',
                    },
                    value: 'a1d8d2a3-3c96-4862-904e-a874bef76a57',
                  },
                },
                input: {
                  response: {
                    type: 'string',
                    require: true,
                    alias: 'response',
                  },
                },
                output: {},
              },
              author: 'lw-Sany',
              repository: 'https://github.com/UBV/ResultParser',
              bugs: 'https://github.com/UBV/ResultParser/issues',
              codeEditor: false,
              id: 'b78ac9ce-d8f4-4e76-84eb-f38cf12a992a',
              _id: 'IIPdi27QjBzC76Ag',
              createdAt: '2022-06-05T15:14:02.102Z',
              updatedAt: '2022-07-14T18:56:31.401Z',
              ifShow: true,
              customId: 'node_8a9c1478',
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                },
                items: [
                  {
                    customId: 'port_59b0c7f5',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'response',
                      type: 'string',
                      require: true,
                      alias: 'response',
                    },
                    color: '#165b5c',
                    id: 'b97034ff-227c-4f7f-bb0d-8ad3248ba819',
                  },
                ],
              },
              position: {
                x: -240,
                y: 2050,
              },
              size: {
                width: 300,
                height: 130,
              },
              dropDownCheckBox: [],
              parent: 'group_e0278e38',
            },
            {
              alias: 'DataServer',
              name: 'DataServer',
              description: 'This is a DataServer plugin',
              version: '0.0.1',
              buildIn: false,
              useGpu: false,
              category: 'TOOL',
              config: {
                module: 'TOOL__C__DataServer',
                executor: 'DataServer',
                initParams: {},
                input: {
                  status: {
                    type: 'int',
                    require: true,
                    alias: 'status',
                  },
                  show_img_path: {
                    type: 'string',
                    require: false,
                    alias: 'show_img_path',
                  },
                },
                output: {},
                group: [],
              },
              author: 'liwen',
              updatedAt: '2022-07-21T04:56:06.372Z',
              _id: 'bf1BpfxQGLUzkw2c',
              createdAt: '2022-07-14T01:21:14.656Z',
              id: 'dc4e22e5-a1fe-4d99-9f2b-01367e813b1b',
              ifShow: true,
              customId: 'node_45487823',
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                },
                items: [
                  {
                    customId: 'port_efc2214c',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'status',
                      type: 'int',
                      require: true,
                      alias: 'status',
                    },
                    color: '#7a3f59',
                    id: '91a87f00-4441-4857-8dae-dfc363367917',
                  },
                  {
                    customId: 'port_25177c19',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'show_img_path',
                      type: 'string',
                      require: false,
                      alias: 'show_img_path',
                    },
                    color: '#165b5c',
                    id: '2712f986-c147-49dc-8f9a-ffd4a6f07f90',
                  },
                ],
              },
              position: {
                x: 850.0000000000011,
                y: 2590.0000000000027,
              },
              size: {
                width: 300,
                height: 130,
              },
              dropDownCheckBox: [],
              parent: 'group_490b7b77',
            },
            {
              alias: 'Glue_Responser_Parser',
              name: 'Glue_Responser_Parser',
              description: 'TOOL__C__Glue_Responser_Parser',
              version: '1.0.0',
              buildIn: false,
              useGpu: false,
              category: 'TOOL',
              config: {
                module: 'TOOL__C__Glue_Responser_Parser',
                executor: 'parse',
                initParams: {},
                input: {
                  status: {
                    type: 'int',
                    require: true,
                    alias: 'status',
                  },
                },
                output: {
                  message: {
                    type: 'string',
                    alias: 'message',
                  },
                },
                group: [],
              },
              author: 'sf-Sany',
              updatedAt: '2022-07-21T05:03:56.951Z',
              id: '8989a55c-1f87-404a-8135-58dab5225829',
              _id: 'FfSVdxh6bFjrCZKe',
              createdAt: '2022-07-21T05:03:51.617Z',
              ifShow: true,
              customId: 'node_86392e2f',
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                },
                items: [
                  {
                    customId: 'port_a1e0e149',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'status',
                      type: 'int',
                      require: true,
                      alias: 'status',
                    },
                    color: '#7a3f59',
                    id: '6015e6e3-466d-4099-ae40-413e5e2b4ee4',
                  },
                  {
                    customId: 'port_d5ae06df',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'message',
                      type: 'string',
                      alias: 'message',
                    },
                    color: '#165b5c',
                    id: 'a3a0a2a0-48e1-41c1-93fa-21e92497380f',
                  },
                ],
              },
              position: {
                x: 550.0000000000011,
                y: 1990.0000000000027,
              },
              size: {
                width: 300,
                height: 130,
              },
              dropDownCheckBox: [],
              parent: 'group_490b7b77',
            },
            {
              alias: 'Business_Glue_Station',
              name: 'Business_Glue_Station',
              description: 'This is a business  plugin for Glue station',
              version: '0.0.1',
              buildIn: false,
              useGpu: false,
              category: 'CV',
              config: {
                module: 'CV__C__Business_Glue_Station',
                executor: 'Business_Glue_Station',
                initParams: {
                  glue_width_max: {
                    name: 'glue_width_max',
                    alias: 'glue_width_max',
                    require: false,
                    value: 80,
                    type: 'int',
                    widget: {
                      type: 'InputNumber',
                      max: 300,
                      min: 0,
                      step: 1,
                      precision: 0,
                    },
                  },
                  glue_width_min: {
                    name: 'glue_width_min',
                    alias: 'glue_width_min',
                    require: false,
                    value: 1,
                    type: 'int',
                    widget: {
                      type: 'InputNumber',
                      max: 300,
                      min: 0,
                      step: 1,
                      precision: 0,
                    },
                  },
                },
                input: {
                  srcImg: {
                    type: 'numpy.ndarray',
                    require: true,
                    alias: 'srcImg',
                  },
                  maskImg: {
                    type: 'numpy.ndarray',
                    require: true,
                    alias: 'maskImg',
                  },
                },
                output: {
                  status: {
                    type: 'int',
                    alias: 'status',
                  },
                  showImg: {
                    type: 'numpy.ndarray',
                    alias: 'showImg',
                  },
                },
                group: [],
              },
              author: 'Sany-ShenFei',
              updatedAt: '2022-07-21T05:10:19.588Z',
              id: '00798d3e-b188-4dec-a9bb-094552db721b',
              _id: 'rwz6WHooi52rSoQo',
              createdAt: '2022-07-21T05:00:31.271Z',
              ifShow: true,
              customId: 'node_90cc8e9d',
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                },
                items: [
                  {
                    customId: 'port_491f4c24',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'srcImg',
                      type: 'numpy.ndarray',
                      require: true,
                      alias: 'srcImg',
                    },
                    color: '#1acccf',
                    id: '1a2addf1-bd70-47bd-99dd-c436db43a226',
                  },
                  {
                    customId: 'port_c8b102bf',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'maskImg',
                      type: 'numpy.ndarray',
                      require: true,
                      alias: 'maskImg',
                    },
                    color: '#1acccf',
                    id: '0551c2e5-658e-4cb4-ba93-19afc1f138d1',
                  },
                  {
                    customId: 'port_e1b3adac',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'status',
                      type: 'int',
                      alias: 'status',
                    },
                    color: '#7a3f59',
                    id: 'a7f6b04f-baa7-4a5e-901c-d41889514c80',
                  },
                  {
                    customId: 'port_d4718e1c',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'showImg',
                      type: 'numpy.ndarray',
                      alias: 'showImg',
                    },
                    color: '#1acccf',
                    id: 'ce651fd7-c5f2-4e6b-a719-6f877a53ca65',
                  },
                ],
              },
              position: {
                x: 880.0000000000011,
                y: 1690.0000000000027,
              },
              size: {
                width: 300,
                height: 130,
              },
              dropDownCheckBox: [],
              parent: 'group_490b7b77',
            },
            {
              alias: '服务TCPServer',
              name: 'TcpServer',
              description:
                'TCP服务插件，跟监听指定端口的请求，并根据"默认异常响应信息"和 "异常中断响应表" 进行响应',
              version: '0.0.2',
              buildIn: false,
              useGpu: false,
              category: 'SERV',
              config: {
                module: 'SERV__A__TcpServer',
                executor: 'TcpServer',
                initParams: {
                  port: {
                    name: 'port',
                    alias: 'port',
                    require: true,
                    default: 2000,
                    value: 5547,
                    type: 'int',
                    description: '监听端口',
                    widget: {
                      type: 'InputNumber',
                      max: 65535,
                      min: 1000,
                      step: 1,
                      precision: 0,
                    },
                  },
                  default_res_msg: {
                    name: 'default_res_msg',
                    alias: '默认异常响应信息',
                    require: true,
                    default: 'ERROR',
                    value: 'ERROR',
                    type: 'string',
                    description: '默认异常响应信息',
                    widget: {
                      type: 'Input',
                    },
                  },
                  response_template: {
                    name: 'response_template',
                    alias: '异常中断响应表',
                    require: false,
                    default: '{}',
                    type: 'string',
                    widget: {
                      type: 'codeEditor',
                    },
                    value: '{}',
                  },
                },
                input: {},
                output: {
                  message: {
                    type: 'string',
                    alias: 'message',
                  },
                },
                group: [],
              },
              author: 'liwen',
              repository: 'https://github.com/UBV/TcpServer',
              bugs: 'https://github.com/UBV/TcpServer/issues',
              id: 'bbdd935f-f587-4db9-ad66-f32caec4d18b',
              _id: '1DBwzaY2tR0lAQ2J',
              createdAt: '2022-06-21T10:16:06.395Z',
              updatedAt: '2022-07-14T18:56:31.402Z',
              ifShow: true,
              customId: 'node_45ed4f5c',
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                },
                items: [
                  {
                    customId: 'port_688d2b5c',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'message',
                      type: 'string',
                      alias: 'message',
                    },
                    color: '#165b5c',
                    id: 'a0ae4b81-5784-4661-b4d5-400266424ccd',
                  },
                ],
              },
              position: {
                x: 600,
                y: 640,
              },
              dropDownCheckBox: [],
              size: {
                width: 300,
                height: 130,
              },
            },
          ],
          edges: [
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#165b5c',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: '31632592-8086-42b8-938a-de01e4ed5ba8',
              parent: 'group_e0278e38',
              data: {
                status: 'STOPPED',
                graphLock: false,
                guid: '4f97ab41',
              },
              source: {
                cell: 'b5fef33b-ede1-4d8a-888c-2bbfce294b98',
                port: '058e4bdb-167e-48f4-9188-3273baff14e4',
              },
              target: {
                cell: 'b78ac9ce-d8f4-4e76-84eb-f38cf12a992a',
                port: 'b97034ff-227c-4f7f-bb0d-8ad3248ba819',
              },
            },
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#165b5c',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: 'daec7b08-45f6-4891-974b-bc9a198a8238',
              parent: 'group_e0278e38',
              data: {
                status: 'STOPPED',
                graphLock: false,
                guid: 'bdd8acb0',
              },
              source: {
                cell: 'a1d8d2a3-3c96-4862-904e-a874bef76a57',
                port: '9591d6e0-64ca-4d8c-b42b-29f439ac3e0f',
              },
              target: {
                cell: 'b5fef33b-ede1-4d8a-888c-2bbfce294b98',
                port: '88ffbb5b-d26a-42d3-9f91-337e0436d92a',
              },
            },
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#1acccf',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: '3b4fd793-123a-440d-ac6a-507e687acfb0',
              parent: 'group_490b7b77',
              data: {
                status: 'STOPPED',
                graphLock: false,
                guid: 'c746c605',
              },
              source: {
                cell: 'c98381bf-8e21-443b-b241-ee8a07d11b7b',
                port: '7961fb07-7eec-443e-91c5-6a3177732566',
              },
              target: {
                cell: '00798d3e-b188-4dec-a9bb-094552db721b',
                port: '1a2addf1-bd70-47bd-99dd-c436db43a226',
              },
            },
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#1acccf',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: '7fc677de-9e0c-4d08-a895-ce783dfe2928',
              data: {
                status: 'STOPPED',
                graphLock: false,
                guid: '68bd30c1',
              },
              parent: 'group_490b7b77',
              source: {
                cell: 'c98381bf-8e21-443b-b241-ee8a07d11b7b',
                port: '7961fb07-7eec-443e-91c5-6a3177732566',
              },
              target: {
                cell: '56284350-1bc5-465f-b7d4-2c7fbe94097d',
                port: '7c77e391-3961-4bbb-b009-a347149b449e',
              },
            },
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#165b5c',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: 'b935179d-0abb-4141-9eee-313fe6d07003',
              data: {
                status: 'STOPPED',
                graphLock: false,
                guid: 'c285aaf4',
              },
              parent: 'group_490b7b77',
              source: {
                cell: 'c98381bf-8e21-443b-b241-ee8a07d11b7b',
                port: '51510414-8a0c-49f6-a6b0-3eec528bed65',
              },
              target: {
                cell: '56284350-1bc5-465f-b7d4-2c7fbe94097d',
                port: 'c74b7ffb-9cab-4583-92ec-9700ce552318',
              },
            },
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#1acccf',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: 'da5b3fdd-f8da-4b6a-9e21-bbbbe388d722',
              data: {
                status: 'STOPPED',
                graphLock: false,
                guid: 'c002a448',
              },
              parent: 'group_490b7b77',
              source: {
                cell: 'c98381bf-8e21-443b-b241-ee8a07d11b7b',
                port: '7961fb07-7eec-443e-91c5-6a3177732566',
              },
              target: {
                cell: '1f90147b-c49c-4884-803f-1c97f9824655',
                port: '32f85b78-82b7-4bd8-b2c9-43a3a5a7903f',
              },
            },
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#165b5c',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: '1bd00053-dd11-43d7-bb29-be47cbb15b3f',
              source: {
                cell: '3e41e3d3-2ef4-44fc-9771-d352e634dfdf',
                port: 'c2aeed53-807a-49ea-b265-6f0f206064d6',
              },
              target: {
                cell: 'c98381bf-8e21-443b-b241-ee8a07d11b7b',
                port: '8c3b5c46-5934-496d-ac5f-d8b1ca403188',
              },
            },
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#7a3f59',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: '957cb389-aa29-42f7-b182-ea918580d9b0',
              data: {
                status: 'STOPPED',
                graphLock: false,
                guid: 'f303258c',
              },
              parent: 'group_490b7b77',
              source: {
                cell: '00798d3e-b188-4dec-a9bb-094552db721b',
                port: 'a7f6b04f-baa7-4a5e-901c-d41889514c80',
              },
              target: {
                cell: '8989a55c-1f87-404a-8135-58dab5225829',
                port: '6015e6e3-466d-4099-ae40-413e5e2b4ee4',
              },
            },
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#1acccf',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: 'a367cd6d-29d2-4df9-9e78-b1b05a6286a8',
              data: {
                status: 'STOPPED',
                graphLock: false,
                guid: '669c38bd',
              },
              parent: 'group_490b7b77',
              source: {
                cell: '00798d3e-b188-4dec-a9bb-094552db721b',
                port: 'ce651fd7-c5f2-4e6b-a719-6f877a53ca65',
              },
              target: {
                cell: '45e063e4-8d3e-4e10-a1cd-48be2f78e97a',
                port: '71cb731c-4648-41d6-933a-946f2a0db521',
              },
            },
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#7a3f59',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: '79727e41-f91a-42af-8610-bf695d1d5bab',
              data: {
                status: 'STOPPED',
                graphLock: false,
                guid: 'c88e20bc',
              },
              parent: 'group_490b7b77',
              source: {
                cell: '00798d3e-b188-4dec-a9bb-094552db721b',
                port: 'a7f6b04f-baa7-4a5e-901c-d41889514c80',
              },
              target: {
                cell: 'dc4e22e5-a1fe-4d99-9f2b-01367e813b1b',
                port: '91a87f00-4441-4857-8dae-dfc363367917',
              },
            },
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#1acccf',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: '198f0bee-a079-4393-a218-eff672ec0e45',
              data: {
                status: 'STOPPED',
                graphLock: false,
                guid: '14f3b8d0',
              },
              parent: 'group_490b7b77',
              source: {
                cell: '1f90147b-c49c-4884-803f-1c97f9824655',
                port: '3419b89d-70be-479c-9877-75ce3bcfdf98',
              },
              target: {
                cell: '00798d3e-b188-4dec-a9bb-094552db721b',
                port: '0551c2e5-658e-4cb4-ba93-19afc1f138d1',
              },
            },
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#165b5c',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: 'b46c8c19-0e51-48a0-8aca-c194b6478543',
              data: {
                status: 'STOPPED',
                graphLock: false,
                guid: 'fb78dabc',
              },
              parent: 'group_490b7b77',
              source: {
                cell: '8989a55c-1f87-404a-8135-58dab5225829',
                port: 'a3a0a2a0-48e1-41c1-93fa-21e92497380f',
              },
              target: {
                cell: 'b4f890bc-3254-4e03-a4bb-7e16b8d5534d',
                port: 'b6e929c7-606a-477d-9de1-9c5751936aca',
              },
            },
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#165b5c',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: '83b3763e-8da2-4e7e-ae9e-d57b4bc9c113',
              data: {
                status: 'STOPPED',
                graphLock: false,
                guid: 'e4af8da9',
              },
              parent: 'group_490b7b77',
              source: {
                cell: '45e063e4-8d3e-4e10-a1cd-48be2f78e97a',
                port: '5c66b076-ef20-4c1e-8c41-683c8ba170b2',
              },
              target: {
                cell: 'dc4e22e5-a1fe-4d99-9f2b-01367e813b1b',
                port: '2712f986-c147-49dc-8f9a-ffd4a6f07f90',
              },
            },
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#165b5c',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: '4c9746a9-80ec-49af-aeeb-68f273ee6346',
              source: {
                cell: 'bbdd935f-f587-4db9-ad66-f32caec4d18b',
                port: 'a0ae4b81-5784-4661-b4d5-400266424ccd',
              },
              target: {
                cell: '3e41e3d3-2ef4-44fc-9771-d352e634dfdf',
                port: '627134a1-328f-4aa2-8125-efef9f5b23ec',
              },
            },
          ],
        },
        commonInfo: {
          productionInfo: '涂布机正极',
          stationInfo: '工位1A面',
          useInfo: '尺寸测量与缺陷检测',
        },
        contentData: {
          home: [
            {
              i: 'slider-1',
              x: 0,
              y: 0,
              w: 16,
              h: 8,
              minW: 1,
              maxW: 12,
              minH: 2,
              maxH: 30,
            },
            {
              i: 'slider-2',
              x: 0,
              y: 8,
              w: 16,
              h: 14,
              minW: 1,
              maxW: 12,
              minH: 2,
              maxH: 30,
            },
            {
              i: 'slider-3',
              x: 0,
              y: 22,
              w: 0,
              h: 0,
              minW: 0,
              maxW: 12,
              minH: 0,
              maxH: 30,
            },
            {
              i: 'footer-1',
              x: 16,
              y: 28,
              w: 0,
              h: 0,
              minW: 0,
              maxW: 12,
              minH: 0,
              maxH: 30,
            },
            {
              i: 'footer-2',
              x: 0,
              y: 36,
              w: 16,
              h: 12,
              minW: 1,
              maxW: 12,
              minH: 2,
              maxH: 30,
            },
          ],
          content: [
            {
              value: ['2a70d16c-b7b9-4c16-ab56-b3300868978a', 'filepath'],
              size: {
                i: '2a70d16c-b7b9-4c16-ab56-b3300868978a$$filepath$$img',
                x: 56,
                y: 0,
                w: 40,
                h: 16,
                minW: 1,
                maxW: 12,
                minH: 2,
                maxH: 30,
              },
              type: 'img',
              tab: '1',
              id: '2a70d16c-b7b9-4c16-ab56-b3300868978a$$filepath$$img',
            },
            {
              value: ['a1a484e9-62f5-47e1-8ee7-e7cc70321f83', 'filepath'],
              size: {
                i: 'a1a484e9-62f5-47e1-8ee7-e7cc70321f83$$filepath$$img',
                x: 16,
                y: 0,
                w: 40,
                h: 16,
                minW: 1,
                maxW: 12,
                minH: 2,
                maxH: 30,
              },
              type: 'img',
              tab: '1',
              id: 'a1a484e9-62f5-47e1-8ee7-e7cc70321f83$$filepath$$img',
            },
            {
              value: ['26f998e5-35fd-4df4-80d9-9c4d508258a8', 'data'],
              size: {
                i: '26f998e5-35fd-4df4-80d9-9c4d508258a8$$data$$line',
                x: 16,
                y: 34,
                w: 40,
                h: 14,
                minW: 1,
                maxW: 12,
                minH: 2,
                maxH: 30,
              },
              type: 'line',
              tab: '1',
              yName: 'y',
              xName: 'x',
              id: '26f998e5-35fd-4df4-80d9-9c4d508258a8$$data$$line',
            },
            {
              value: ['2ee757df-57c4-4c44-b5de-64393579dc27', 'data'],
              size: {
                i: '2ee757df-57c4-4c44-b5de-64393579dc27$$data$$line',
                x: 56,
                y: 34,
                w: 40,
                h: 14,
                minW: 1,
                maxW: 12,
                minH: 2,
                maxH: 30,
              },
              type: 'line',
              tab: '1',
              yName: 'y',
              xName: 'x',
              id: '2ee757df-57c4-4c44-b5de-64393579dc27$$data$$line',
            },
            {
              id: '288dbda3-9ea2-426d-b858-9c7be9787909$$data$$table',
              value: ['288dbda3-9ea2-426d-b858-9c7be9787909', 'data'],
              size: {
                i: '288dbda3-9ea2-426d-b858-9c7be9787909$$data$$table',
                x: 0,
                y: 22,
                w: 16,
                h: 14,
                minW: 1,
                maxW: 12,
                minH: 2,
                maxH: 30,
              },
              type: 'table',
              tab: '1',
              yName: '\u8d44\u6e90\u540d\u79f0',
              xName: '\u72b6\u6001',
              fontSize: 14,
              reverse: false,
            },
            {
              value: ['6a14a210-10f7-4d3b-92e1-a6741a7783fd', 'data'],
              size: {
                i: '6a14a210-10f7-4d3b-92e1-a6741a7783fd$$data$$table2',
                x: 56,
                y: 16,
                w: 40,
                h: 18,
                minW: 1,
                maxW: 12,
                minH: 2,
                maxH: 30,
              },
              type: 'table2',
              tab: '1',
              fontSize: 18,
              id: '6a14a210-10f7-4d3b-92e1-a6741a7783fd$$data$$table2',
            },
            {
              id: 'a1a484e9-62f5-47e1-8ee7-e7cc70321f83$$filepath$$table2',
              value: ['a1a484e9-62f5-47e1-8ee7-e7cc70321f83', 'filepath'],
              size: {
                i: 'a1a484e9-62f5-47e1-8ee7-e7cc70321f83$$filepath$$table2',
                x: 16,
                y: 16,
                w: 40,
                h: 18,
                minW: 1,
                maxW: 12,
                minH: 2,
                maxH: 30,
              },
              type: 'table2',
              tab: '1',
              fontSize: 18,
              reverse: false,
            },
          ],
          footerSelectList: [
            '4385f168-11c3-4fbd-8f10-968cf710723a',
            'a7e08edd-dd68-4a29-b612-fa448dfab080',
            '00693b57-6c82-4250-8e78-4b06c92202bb',
          ],
          theme: 'realDark',
          contentHeader: {
            'slider-1': true,
            'slider-2': true,
            'slider-3': true,
            'footer-1': true,
            'footer-2': true,
            '2a70d16c-b7b9-4c16-ab56-b3300868978a$$filepath$$img': true,
            'a1a484e9-62f5-47e1-8ee7-e7cc70321f83$$filepath$$img': true,
            '26f998e5-35fd-4df4-80d9-9c4d508258a8$$data$$line': true,
            '2ee757df-57c4-4c44-b5de-64393579dc27$$data$$line': true,
            '288dbda3-9ea2-426d-b858-9c7be9787909$$data$$table': true,
            '6a14a210-10f7-4d3b-92e1-a6741a7783fd$$data$$table2': true,
            '0e8b8d48-f657-459f-adce-38b971b69c30$$data$$table2': true,
          },
        },
        environment: {
          serviceIp: 'localhost',
          servicePort: '18080',
        },
        project_id: '9560c0ea',
      },
      {
        id: 'b64512e',
        name: 'FDX_GLUE_正式',
        description: '分动箱涂胶',
        plugin_path: '/opt/ubvision/tujiao/plugins',
        zoom: 0.4200913242009132,
        graphLock: false,
        position: {
          x: 967.2173913043479,
          y: -609.9999999999999,
        },
        flowData: {
          groups: [
            {
              position: {
                x: 310,
                y: 580,
              },
              size: {
                width: 1720,
                height: 280,
              },
              attrs: {
                body: {
                  fill: '#2E394D',
                },
                buttonSign: {
                  d: 'M 2 5 8 5',
                },
                label: {
                  text: 'group_6a56067b',
                },
              },
              id: 'group_6a56067b',
              shape: 'dag-group',
              customId: 'group_6a56067b',
              childrenList: ['3e41e3d3-2ef4-44fc-9771-d352e634dfdf'],
              zIndex: 0,
              children: ['3e41e3d3-2ef4-44fc-9771-d352e634dfdf'],
              originPosition: {
                x: 310,
                y: 580,
              },
              originSize: {
                width: 1720,
                height: 280,
              },
            },
            {
              position: {
                x: -340,
                y: 1100,
              },
              size: {
                width: 440,
                height: 1120,
              },
              attrs: {
                body: {
                  fill: '#2E394D',
                },
                buttonSign: {
                  d: 'M 2 5 8 5',
                },
                label: {
                  text: 'group_e0278e38',
                },
              },
              id: 'group_e0278e38',
              shape: 'dag-group',
              customId: 'group_e0278e38',
              childrenList: [
                'b78ac9ce-d8f4-4e76-84eb-f38cf12a992a',
                'a1d8d2a3-3c96-4862-904e-a874bef76a57',
                'b5fef33b-ede1-4d8a-888c-2bbfce294b98',
              ],
              zIndex: 0,
              children: [
                'b78ac9ce-d8f4-4e76-84eb-f38cf12a992a',
                'a1d8d2a3-3c96-4862-904e-a874bef76a57',
                'b5fef33b-ede1-4d8a-888c-2bbfce294b98',
              ],
              originPosition: {
                x: -340,
                y: 1100,
              },
              originSize: {
                width: 440,
                height: 1100,
              },
            },
            {
              position: {
                x: 320,
                y: 1020,
              },
              size: {
                width: 1770,
                height: 1810,
              },
              attrs: {
                body: {
                  fill: '#2E394D',
                },
                buttonSign: {
                  d: 'M 2 5 8 5',
                },
                label: {
                  text: 'group_490b7b77',
                },
              },
              id: 'group_490b7b77',
              shape: 'dag-group',
              customId: 'group_490b7b77',
              childrenList: [
                'c98381bf-8e21-443b-b241-ee8a07d11b7b',
                '00798d3e-b188-4dec-a9bb-094552db721b',
                '8989a55c-1f87-404a-8135-58dab5225829',
                'b4f890bc-3254-4e03-a4bb-7e16b8d5534d',
                '45e063e4-8d3e-4e10-a1cd-48be2f78e97a',
                '56284350-1bc5-465f-b7d4-2c7fbe94097d',
                '1f90147b-c49c-4884-803f-1c97f9824655',
                'dc4e22e5-a1fe-4d99-9f2b-01367e813b1b',
              ],
              zIndex: 0,
              children: [
                'c98381bf-8e21-443b-b241-ee8a07d11b7b',
                '00798d3e-b188-4dec-a9bb-094552db721b',
                '8989a55c-1f87-404a-8135-58dab5225829',
                'b4f890bc-3254-4e03-a4bb-7e16b8d5534d',
                '45e063e4-8d3e-4e10-a1cd-48be2f78e97a',
                '56284350-1bc5-465f-b7d4-2c7fbe94097d',
                '1f90147b-c49c-4884-803f-1c97f9824655',
                'dc4e22e5-a1fe-4d99-9f2b-01367e813b1b',
              ],
              originPosition: {
                x: 320,
                y: 1020,
              },
              originSize: {
                width: 1770,
                height: 1810,
              },
            },
          ],
          nodes: [
            {
              name: 'ImageStorge',
              version: '0.0.2',
              category: 'DS',
              description: 'This is a DataStorage plugin',
              author: 'liwen',
              config: {
                module: 'DS__A__ImageStorge',
                executor: 'ImageStorge',
                initParams: {
                  store_dir: {
                    name: 'store_dir',
                    alias: '存图目录',
                    require: true,
                    onHidden: true,
                    default: '/tmp/ubvision',
                    value: '/data/pangu-fs/track-inspect',
                    type: 'Dir',
                    description: '选择一个存图目录',
                    widget: {
                      type: 'Dir',
                    },
                  },
                  target_format: {
                    name: 'target_format',
                    alias: '存图格式',
                    require: true,
                    default: 'jpg',
                    value: '.jpg',
                    type: 'List[string]',
                    widget: {
                      type: 'Radio',
                      options: ['.jpg', '.png', '.bmp'],
                    },
                  },
                },
                input: {
                  src_img: {
                    type: 'numpy.ndarray',
                    require: true,
                    alias: 'src_img',
                  },
                  category: {
                    type: 'string',
                    require: false,
                    alias: 'category',
                  },
                  img_name: {
                    type: 'string',
                    require: false,
                    alias: 'img_name',
                  },
                },
                output: {
                  status: {
                    type: 'bool',
                    alias: 'status',
                  },
                  category: {
                    type: 'string',
                    alias: 'category',
                  },
                  store_path: {
                    type: 'string',
                    alias: 'store_path',
                  },
                },
              },
              alias: '图片存储器ImgStorge',
              buildIn: false,
              useGpu: false,
              id: '45e063e4-8d3e-4e10-a1cd-48be2f78e97a',
              _id: 'SNF8MEF6cMipAYTE',
              createdAt: '2022-06-21T10:15:17.282Z',
              updatedAt: '2022-06-21T10:17:15.705Z',
              ifShow: true,
              customId: 'node_d732fd33',
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                },
                items: [
                  {
                    customId: 'port_1f452085',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'src_img',
                      type: 'numpy.ndarray',
                      require: true,
                      alias: 'src_img',
                    },
                    color: '#1acccf',
                    id: '71cb731c-4648-41d6-933a-946f2a0db521',
                  },
                  {
                    customId: 'port_ac4beda0',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'category',
                      type: 'string',
                      require: false,
                      alias: 'category',
                    },
                    color: '#165b5c',
                    id: 'e5d20ecc-b2dc-4d2f-a7b4-bf0ecc1bcaa6',
                  },
                  {
                    customId: 'port_b1ee47eb',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'img_name',
                      type: 'string',
                      require: false,
                      alias: 'img_name',
                    },
                    color: '#165b5c',
                    id: 'e7e1dabe-8ba7-4c39-a787-f0fbbcd4cfba',
                  },
                  {
                    customId: 'port_b86c9517',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'status',
                      type: 'bool',
                      alias: 'status',
                    },
                    color: '#7d573a',
                    id: 'f409838a-abbb-4f7e-8e14-98432257447a',
                  },
                  {
                    customId: 'port_1a110c28',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'category',
                      type: 'string',
                      alias: 'category',
                    },
                    color: '#165b5c',
                    id: 'd87d04e9-331f-4334-922d-6c826211a848',
                  },
                  {
                    customId: 'port_508b1d0d',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'store_path',
                      type: 'string',
                      alias: 'store_path',
                    },
                    color: '#165b5c',
                    id: '5c66b076-ef20-4c1e-8c41-683c8ba170b2',
                  },
                ],
              },
              position: {
                x: 1060.0000000000011,
                y: 2000.0000000000027,
              },
              dropDownCheckBox: ['result'],
              size: {
                width: 480,
                height: 370,
              },
              parent: 'group_490b7b77',
            },
            {
              name: 'ImageStorge.json',
              version: '0.0.2',
              category: 'DS',
              description: 'This is a DataStorage plugin',
              author: 'liwen',
              config: {
                module: 'DS__A__ImageStorge',
                executor: 'ImageStorge',
                initParams: {
                  store_dir: {
                    name: 'store_dir',
                    alias: '存图目录',
                    require: true,
                    onHidden: true,
                    default: '/tmp/ubvision',
                    value: '/data/simulate/images',
                    type: 'Dir',
                    description: '选择一个存图目录',
                    widget: {
                      type: 'Dir',
                    },
                  },
                  target_format: {
                    name: 'target_format',
                    alias: '存图格式',
                    require: true,
                    default: 'jpg',
                    value: '.jpg',
                    type: 'List[string]',
                    widget: {
                      type: 'Radio',
                      options: ['.jpg', '.png', '.bmp'],
                    },
                  },
                },
                input: {
                  src_img: {
                    type: 'numpy.ndarray',
                    require: true,
                    alias: 'src_img',
                  },
                  category: {
                    type: 'string',
                    require: false,
                    alias: 'category',
                  },
                  img_name: {
                    type: 'string',
                    require: false,
                    alias: 'img_name',
                  },
                },
                output: {
                  status: {
                    type: 'bool',
                    alias: 'status',
                  },
                  category: {
                    type: 'string',
                    alias: 'category',
                  },
                  store_path: {
                    type: 'string',
                    alias: 'store_path',
                  },
                },
                group: [],
              },
              alias: '图片存储器ImgStorge.json',
              buildIn: false,
              useGpu: false,
              id: '56284350-1bc5-465f-b7d4-2c7fbe94097d',
              _id: 'SNF8MEF6cMipAYTE',
              createdAt: '2022-06-21T10:15:17.282Z',
              updatedAt: '2022-07-13T11:02:57.716Z',
              ifShow: true,
              customId: 'node_5f987d1b',
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                },
                items: [
                  {
                    customId: 'port_b3a9431b',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'src_img',
                      type: 'numpy.ndarray',
                      require: true,
                      alias: 'src_img',
                    },
                    color: '#1acccf',
                    id: '7c77e391-3961-4bbb-b009-a347149b449e',
                  },
                  {
                    customId: 'port_264baf3a',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'category',
                      type: 'string',
                      require: false,
                      alias: 'category',
                    },
                    color: '#165b5c',
                    id: 'c74b7ffb-9cab-4583-92ec-9700ce552318',
                  },
                  {
                    customId: 'port_0ddb2da7',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'img_name',
                      type: 'string',
                      require: false,
                      alias: 'img_name',
                    },
                    color: '#165b5c',
                    id: '9c65211b-8867-4cb5-8f39-8a21cee512ce',
                  },
                  {
                    customId: 'port_4f452295',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'status',
                      type: 'bool',
                      alias: 'status',
                    },
                    color: '#7d573a',
                    id: '5bdac4c1-3403-47c9-b7a4-7e5fb789559b',
                  },
                  {
                    customId: 'port_a20d197c',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'category',
                      type: 'string',
                      alias: 'category',
                    },
                    color: '#165b5c',
                    id: '28eae3a6-f1d8-4e16-88c9-6e385cac052f',
                  },
                  {
                    customId: 'port_854a6544',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'store_path',
                      type: 'string',
                      alias: 'store_path',
                    },
                    color: '#165b5c',
                    id: '14306f65-e705-4ca7-8769-cc093726a35c',
                  },
                ],
              },
              position: {
                x: 830.0000000000011,
                y: 1370.0000000000027,
              },
              size: {
                width: 444,
                height: 130,
              },
              dropDownCheckBox: ['result'],
              parent: 'group_490b7b77',
            },
            {
              name: 'Responser.json',
              version: '0.0.1',
              category: 'COMM',
              description: 'This is COMM Responser',
              author: 'lw-Sany',
              repository: 'https://github.com/UBV/ResultParser',
              bugs: 'https://github.com/UBV/ResultParser/issues',
              config: {
                module: 'COMM__A__Responser',
                executor: 'Responser',
                initParams: {
                  respond_to: {
                    name: 'respond_to',
                    alias: 'respond_to',
                    require: false,
                    type: 'string',
                    widget: {
                      type: 'Input',
                    },
                    value: '1fbf97c8-d887-43a5-8f2c-ed198e098b8b',
                  },
                },
                input: {
                  response: {
                    type: 'string',
                    require: true,
                    alias: 'response',
                  },
                },
                output: {},
              },
              alias: 'TCP-Responser.json',
              buildIn: false,
              useGpu: false,
              codeEditor: false,
              id: 'b4f890bc-3254-4e03-a4bb-7e16b8d5534d',
              _id: 'IIPdi27QjBzC76Ag',
              createdAt: '2022-06-05T15:14:02.102Z',
              updatedAt: '2022-07-13T11:03:30.387Z',
              ifShow: true,
              customId: 'node_bf76a6ee',
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                },
                items: [
                  {
                    customId: 'port_7987924e',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'response',
                      type: 'string',
                      require: true,
                      alias: 'response',
                    },
                    color: '#165b5c',
                    id: 'b6e929c7-606a-477d-9de1-9c5751936aca',
                  },
                ],
              },
              position: {
                x: 540.0000000000011,
                y: 2280.0000000000027,
              },
              size: {
                width: 300,
                height: 130,
              },
              dropDownCheckBox: [],
              parent: 'group_490b7b77',
            },
            {
              name: 'Glue_Trigger_Parser',
              version: '1.0.0',
              category: 'TOOL',
              description: 'TOOL__C__Glue_Trigger_Parser',
              author: 'sf-Sany',
              config: {
                module: 'TOOL__C__Glue_Trigger_Parser',
                executor: 'parse',
                initParams: {},
                input: {
                  origin_str: {
                    type: 'string',
                    require: true,
                    alias: 'origin_str',
                  },
                },
                output: {
                  camera: {
                    type: 'string',
                    alias: 'camera',
                  },
                  heart: {
                    type: 'string',
                    alias: 'heart',
                  },
                },
                group: [],
              },
              updatedAt: '2022-07-13T13:14:32.108Z',
              id: '3e41e3d3-2ef4-44fc-9771-d352e634dfdf',
              _id: 'cONUuPsSLoL8Rx5F',
              createdAt: '2022-07-13T13:14:24.753Z',
              alias: 'Glue_Trigger_Parser',
              buildIn: false,
              useGpu: false,
              ifShow: true,
              customId: 'node_d2946b47',
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                },
                items: [
                  {
                    customId: 'port_57fac917',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'origin_str',
                      type: 'string',
                      require: true,
                      alias: 'origin_str',
                    },
                    color: '#165b5c',
                    id: '627134a1-328f-4aa2-8125-efef9f5b23ec',
                  },
                  {
                    customId: 'port_b8f22edb',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'camera',
                      type: 'string',
                      alias: 'camera',
                    },
                    color: '#165b5c',
                    id: 'c2aeed53-807a-49ea-b265-6f0f206064d6',
                  },
                  {
                    customId: 'port_0c5a998c',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'heart',
                      type: 'string',
                      alias: 'heart',
                    },
                    color: '#165b5c',
                    id: '8852db72-a768-43d3-b57d-be7443a0202b',
                  },
                ],
              },
              position: {
                x: 1380,
                y: 650.0000000000003,
              },
              size: {
                width: 300,
                height: 130,
              },
              dropDownCheckBox: [],
              parent: 'group_6a56067b',
            },
            {
              alias: 'AIEngine',
              name: 'AIEngine',
              description:
                'This is an ai engine plugin for industrial visual quality inspection\n2022.7.1',
              version: '0.1.0',
              buildIn: false,
              useGpu: true,
              category: 'CV',
              config: {
                module: 'CV__B__AIEngine',
                executor: 'AIEngine',
                initParams: {
                  config_path: {
                    name: 'config_path',
                    alias: 'config_path',
                    require: false,
                    type: 'File',
                    widget: {
                      type: 'File',
                      suffix: [
                        '.jpg/.jpeg',
                        '.png',
                        '.svg',
                        '.pdf',
                        '.pt',
                        '.py',
                        '.doc/.docx',
                        '.csv',
                        '.bmp',
                        '.json',
                        'all',
                      ],
                    },
                    value:
                      '/opt/ubvision/tujiao/resources/configs/seg_swin_transformer_st_tujiao.json',
                  },
                  model_path: {
                    name: 'model_path',
                    alias: 'model_path',
                    require: false,
                    type: 'File',
                    widget: {
                      type: 'File',
                      suffix: [
                        '.jpg/.jpeg',
                        '.png',
                        '.svg',
                        '.pdf',
                        '.pt',
                        '.py',
                        '.doc/.docx',
                        '.csv',
                        '.bmp',
                        '.json',
                        'all',
                      ],
                    },
                    value:
                      '/opt/ubvision/tujiao/resources/models/iter_44000_w1024xh1024_sim_fp32.engine',
                  },
                },
                input: {
                  srcImg: {
                    type: 'numpy.ndarray',
                    require: true,
                    alias: 'srcImg',
                  },
                },
                output: {
                  class_name: {
                    type: 'list',
                    alias: 'class_name',
                  },
                  masks: {
                    type: 'numpy.ndarray',
                    alias: 'masks',
                  },
                  shapes: {
                    type: 'dict',
                    alias: 'shapes',
                  },
                  status: {
                    type: 'bool',
                    alias: 'status',
                  },
                },
                group: [],
              },
              author: 'zwt-Sany',
              repository: 'https://github.com/QIVG/AlgorithmPluginDemo',
              bugs: 'https://github.com/QIVG/AlgorithmPluginDemo/issues',
              _id: 'Ug3bhG8x9kYJHpGM',
              createdAt: '2022-06-17T13:08:34.434Z',
              updatedAt: '2022-07-14T18:56:31.404Z',
              id: '1f90147b-c49c-4884-803f-1c97f9824655',
              ifShow: true,
              customId: 'node_84079990',
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                },
                items: [
                  {
                    customId: 'port_c79f6953',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'srcImg',
                      type: 'numpy.ndarray',
                      require: true,
                      alias: 'srcImg',
                    },
                    color: '#1acccf',
                    id: '32f85b78-82b7-4bd8-b2c9-43a3a5a7903f',
                  },
                  {
                    customId: 'port_e9d93c82',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'class_name',
                      type: 'list',
                      alias: 'class_name',
                    },
                    color: '#694256',
                    id: 'ffde9a57-9e5b-43a2-aeef-47e4f0fb0c8e',
                  },
                  {
                    customId: 'port_5d4da216',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'masks',
                      type: 'numpy.ndarray',
                      alias: 'masks',
                    },
                    color: '#1acccf',
                    id: '3419b89d-70be-479c-9877-75ce3bcfdf98',
                  },
                  {
                    customId: 'port_7d268669',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'shapes',
                      type: 'dict',
                      alias: 'shapes',
                    },
                    color: '#425e7e',
                    id: 'a9186b9f-850a-4a0b-8eb2-aa9ad5ee9c6d',
                  },
                  {
                    customId: 'port_369b74fd',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'status',
                      type: 'bool',
                      alias: 'status',
                    },
                    color: '#7d573a',
                    id: 'd6bdeada-adea-41de-8f90-426e5c945318',
                  },
                ],
              },
              position: {
                x: 1380.0000000000011,
                y: 1350.0000000000027,
              },
              size: {
                width: 592,
                height: 130,
              },
              dropDownCheckBox: [],
              parent: 'group_490b7b77',
            },
            {
              alias: 'GalaxyCamera',
              name: 'GalaxyCamera',
              description: 'GalaxyCamera',
              version: '0.1.0',
              buildIn: false,
              useGpu: false,
              category: 'CAPTURE',
              config: {
                module: 'CAPTURE__B__GalaxyCamera',
                executor: 'Camera',
                initParams: {
                  camera_name: {
                    name: 'camera_name',
                    alias: 'camera_name',
                    require: false,
                    default: 'DefaultCam',
                    value: 'DefaultCam',
                    type: 'string',
                    widget: {
                      type: 'Input',
                    },
                  },
                  serial_number: {
                    name: 'serial_number',
                    alias: 'serial_number',
                    require: true,
                    default: ' ',
                    value: 'LT0210051918',
                    type: 'string',
                    widget: {
                      type: 'Input',
                    },
                  },
                  exposure_time: {
                    name: 'exposure_time',
                    alias: 'exposure_time',
                    require: true,
                    default: 5000,
                    value: 1500,
                    type: 'int',
                    widget: {
                      type: 'InputNumber',
                      max: 100000,
                      min: 500,
                      step: 100,
                      precision: 0,
                    },
                  },
                  data_format: {
                    name: 'data_format',
                    alias: 'data_format',
                    require: false,
                    default: 'RGB',
                    value: 'RGB',
                    type: 'List[string]',
                    widget: {
                      type: 'Radio',
                      options: ['RGB', 'GRAY', 'RAW'],
                    },
                  },
                  interval_time: {
                    name: 'interval_time',
                    alias: 'interval_time',
                    require: true,
                    default: 0,
                    type: 'float',
                    widget: {
                      type: 'InputNumber',
                      max: 5,
                      min: 0,
                      step: 0.05,
                      precision: 2,
                    },
                    value: 0.1,
                  },
                  width: {
                    type: 'float',
                    default: 2048,
                    require: false,
                    widget: {
                      type: 'InputNumber',
                      max: 6000,
                      min: 100,
                      step: 1,
                      precision: 1,
                    },
                    value: 5496,
                    alias: 'width',
                    name: 'width',
                  },
                  height: {
                    type: 'float',
                    default: 2048,
                    require: false,
                    widget: {
                      type: 'InputNumber',
                      max: 6000,
                      min: 100,
                      step: 1,
                      precision: 1,
                    },
                    value: 3672,
                    alias: 'height',
                    name: 'height',
                  },
                  DEV_MAPPER: {
                    type: 'str',
                    default: '/dev/bus/usb',
                    value: '/dev/bus/usb',
                    require: true,
                    widget: {
                      type: 'Input',
                    },
                    alias: 'DEV_MAPPER',
                    name: 'DEV_MAPPER',
                  },
                  NETWORKMODE: {
                    default: 'host',
                    require: true,
                    value: 'host',
                    type: 'List[string]',
                    widget: {
                      type: 'Radio',
                      options: ['host', 'bridge'],
                    },
                    alias: 'NETWORKMODE',
                    name: 'NETWORKMODE',
                  },
                  Gain: {
                    name: 'Gain',
                    alias: 'Gain',
                    require: true,
                    default: 10,
                    value: 10,
                    type: 'float',
                    widget: {
                      type: 'Slider',
                      max: 20,
                      min: 0.1,
                      step: 0.1,
                    },
                  },
                },
                input: {
                  signal: {
                    type: 'string',
                    require: true,
                    alias: 'signal',
                  },
                },
                output: {
                  frame: {
                    type: 'numpy.ndarray',
                    alias: 'frame',
                  },
                  category: {
                    type: 'string',
                    alias: 'category',
                  },
                  status: {
                    type: 'bool',
                    alias: 'status',
                  },
                },
                group: [
                  {
                    id: '76a2eea9',
                    open: false,
                    children: ['NETWORKMODE', 'DEV_MAPPER'],
                    name: 'Advanced Options',
                  },
                ],
              },
              author: 'liwen',
              _id: 'UEpwqYTvke6un0Rs',
              createdAt: '2022-07-10T03:06:07.682Z',
              updatedAt: '2022-07-15T07:45:51.867Z',
              id: 'c98381bf-8e21-443b-b241-ee8a07d11b7b',
              ifShow: true,
              customId: 'node_0bb7ada6',
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                },
                items: [
                  {
                    customId: 'port_b776d46c',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'signal',
                      type: 'string',
                      require: true,
                      alias: 'signal',
                    },
                    color: '#165b5c',
                    id: '8c3b5c46-5934-496d-ac5f-d8b1ca403188',
                  },
                  {
                    customId: 'port_42c40766',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'frame',
                      type: 'numpy.ndarray',
                      alias: 'frame',
                    },
                    color: '#1acccf',
                    id: '7961fb07-7eec-443e-91c5-6a3177732566',
                  },
                  {
                    customId: 'port_a7b8fbcc',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'category',
                      type: 'string',
                      alias: 'category',
                    },
                    color: '#165b5c',
                    id: '51510414-8a0c-49f6-a6b0-3eec528bed65',
                  },
                  {
                    customId: 'port_ddc16065',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'status',
                      type: 'bool',
                      alias: 'status',
                    },
                    color: '#7d573a',
                    id: '7837188d-ec7e-440a-b1d1-396334560acf',
                  },
                ],
              },
              position: {
                x: 810.0000000000011,
                y: 1060.0000000000027,
              },
              size: {
                width: 444,
                height: 130,
              },
              dropDownCheckBox: [],
              parent: 'group_490b7b77',
            },
            {
              alias: '服务TCPServer',
              name: 'TcpServer',
              description:
                'TCP服务插件，跟监听指定端口的请求，并根据"默认异常响应信息"和 "异常中断响应表" 进行响应',
              version: '0.0.2',
              buildIn: false,
              useGpu: false,
              category: 'SERV',
              config: {
                module: 'SERV__A__TcpServer',
                executor: 'TcpServer',
                initParams: {
                  port: {
                    name: 'port',
                    alias: 'port',
                    require: true,
                    default: 2000,
                    value: 5546,
                    type: 'int',
                    description: '监听端口',
                    widget: {
                      type: 'InputNumber',
                      max: 65535,
                      min: 1000,
                      step: 1,
                      precision: 0,
                    },
                  },
                  default_res_msg: {
                    name: 'default_res_msg',
                    alias: '默认异常响应信息',
                    require: true,
                    default: 'ERROR',
                    value: 'ERROR',
                    type: 'string',
                    description: '默认异常响应信息',
                    widget: {
                      type: 'Input',
                    },
                  },
                  response_template: {
                    name: 'response_template',
                    alias: '异常中断响应表',
                    require: false,
                    default: '{}',
                    type: 'string',
                    widget: {
                      type: 'codeEditor',
                    },
                    value: '{}',
                  },
                },
                input: {},
                output: {
                  message: {
                    type: 'string',
                    alias: 'message',
                  },
                },
                group: [],
              },
              author: 'liwen',
              repository: 'https://github.com/UBV/TcpServer',
              bugs: 'https://github.com/UBV/TcpServer/issues',
              id: 'a1d8d2a3-3c96-4862-904e-a874bef76a57',
              _id: '1DBwzaY2tR0lAQ2J',
              createdAt: '2022-06-21T10:16:06.395Z',
              updatedAt: '2022-07-14T18:56:31.402Z',
              ifShow: true,
              customId: 'node_72eca6e4',
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                },
                items: [
                  {
                    customId: 'port_82c0c610',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'message',
                      type: 'string',
                      alias: 'message',
                    },
                    color: '#165b5c',
                    id: '9591d6e0-64ca-4d8c-b42b-29f439ac3e0f',
                  },
                ],
              },
              position: {
                x: -240,
                y: 1160,
              },
              size: {
                width: 300,
                height: 130,
              },
              dropDownCheckBox: [],
              parent: 'group_e0278e38',
            },
            {
              alias: 'Glue_Trigger_Parser',
              name: 'Glue_Trigger_Parser',
              description: 'TOOL__C__Glue_Trigger_Parser',
              version: '1.0.0',
              buildIn: false,
              useGpu: false,
              category: 'TOOL',
              config: {
                module: 'TOOL__C__Glue_Trigger_Parser',
                executor: 'parse',
                initParams: {},
                input: {
                  origin_str: {
                    type: 'string',
                    require: true,
                    alias: 'origin_str',
                  },
                },
                output: {
                  camera: {
                    type: 'string',
                    alias: 'camera',
                  },
                  heart: {
                    type: 'string',
                    alias: 'heart',
                  },
                },
                group: [],
              },
              author: 'sf-Sany',
              updatedAt: '2022-07-19T11:58:18.297Z',
              id: 'b5fef33b-ede1-4d8a-888c-2bbfce294b98',
              _id: 'ywHaV9aVLeaakgcn',
              createdAt: '2022-07-19T11:57:49.555Z',
              ifShow: true,
              customId: 'node_1f183bca',
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                },
                items: [
                  {
                    customId: 'port_ec6ea7e6',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'origin_str',
                      type: 'string',
                      require: true,
                      alias: 'origin_str',
                    },
                    color: '#165b5c',
                    id: '88ffbb5b-d26a-42d3-9f91-337e0436d92a',
                  },
                  {
                    customId: 'port_90b1f6d0',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'camera',
                      type: 'string',
                      alias: 'camera',
                    },
                    color: '#165b5c',
                    id: 'fbcc3c56-0d77-4a49-adf0-2dbf14f03400',
                  },
                  {
                    customId: 'port_4a8425fd',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'heart',
                      type: 'string',
                      alias: 'heart',
                    },
                    color: '#165b5c',
                    id: '058e4bdb-167e-48f4-9188-3273baff14e4',
                  },
                ],
              },
              position: {
                x: -250,
                y: 1600,
              },
              size: {
                width: 300,
                height: 130,
              },
              dropDownCheckBox: [],
              parent: 'group_e0278e38',
            },
            {
              alias: 'TCP-Responser',
              name: 'Responser',
              description: 'This is COMM Responser',
              version: '0.0.1',
              buildIn: false,
              useGpu: false,
              category: 'COMM',
              config: {
                module: 'COMM__A__Responser',
                executor: 'Responser',
                initParams: {
                  respond_to: {
                    name: 'respond_to',
                    alias: 'respond_to',
                    require: false,
                    type: 'string',
                    widget: {
                      type: 'Input',
                    },
                    value: 'a1d8d2a3-3c96-4862-904e-a874bef76a57',
                  },
                },
                input: {
                  response: {
                    type: 'string',
                    require: true,
                    alias: 'response',
                  },
                },
                output: {},
              },
              author: 'lw-Sany',
              repository: 'https://github.com/UBV/ResultParser',
              bugs: 'https://github.com/UBV/ResultParser/issues',
              codeEditor: false,
              id: 'b78ac9ce-d8f4-4e76-84eb-f38cf12a992a',
              _id: 'IIPdi27QjBzC76Ag',
              createdAt: '2022-06-05T15:14:02.102Z',
              updatedAt: '2022-07-14T18:56:31.401Z',
              ifShow: true,
              customId: 'node_8a9c1478',
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                },
                items: [
                  {
                    customId: 'port_59b0c7f5',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'response',
                      type: 'string',
                      require: true,
                      alias: 'response',
                    },
                    color: '#165b5c',
                    id: 'b97034ff-227c-4f7f-bb0d-8ad3248ba819',
                  },
                ],
              },
              position: {
                x: -240,
                y: 2050,
              },
              size: {
                width: 300,
                height: 130,
              },
              dropDownCheckBox: [],
              parent: 'group_e0278e38',
            },
            {
              alias: 'DataServer',
              name: 'DataServer',
              description: 'This is a DataServer plugin',
              version: '0.0.1',
              buildIn: false,
              useGpu: false,
              category: 'TOOL',
              config: {
                module: 'TOOL__C__DataServer',
                executor: 'DataServer',
                initParams: {},
                input: {
                  status: {
                    type: 'int',
                    require: true,
                    alias: 'status',
                  },
                  show_img_path: {
                    type: 'string',
                    require: false,
                    alias: 'show_img_path',
                  },
                },
                output: {},
                group: [],
              },
              author: 'liwen',
              updatedAt: '2022-07-21T04:56:06.372Z',
              _id: 'bf1BpfxQGLUzkw2c',
              createdAt: '2022-07-14T01:21:14.656Z',
              id: 'dc4e22e5-a1fe-4d99-9f2b-01367e813b1b',
              ifShow: true,
              customId: 'node_45487823',
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                },
                items: [
                  {
                    customId: 'port_efc2214c',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'status',
                      type: 'int',
                      require: true,
                      alias: 'status',
                    },
                    color: '#7a3f59',
                    id: '91a87f00-4441-4857-8dae-dfc363367917',
                  },
                  {
                    customId: 'port_25177c19',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'show_img_path',
                      type: 'string',
                      require: false,
                      alias: 'show_img_path',
                    },
                    color: '#165b5c',
                    id: '2712f986-c147-49dc-8f9a-ffd4a6f07f90',
                  },
                ],
              },
              position: {
                x: 850.0000000000011,
                y: 2590.0000000000027,
              },
              size: {
                width: 300,
                height: 130,
              },
              dropDownCheckBox: [],
              parent: 'group_490b7b77',
            },
            {
              alias: 'Glue_Responser_Parser',
              name: 'Glue_Responser_Parser',
              description: 'TOOL__C__Glue_Responser_Parser',
              version: '1.0.0',
              buildIn: false,
              useGpu: false,
              category: 'TOOL',
              config: {
                module: 'TOOL__C__Glue_Responser_Parser',
                executor: 'parse',
                initParams: {},
                input: {
                  status: {
                    type: 'int',
                    require: true,
                    alias: 'status',
                  },
                },
                output: {
                  message: {
                    type: 'string',
                    alias: 'message',
                  },
                },
                group: [],
              },
              author: 'sf-Sany',
              updatedAt: '2022-07-21T05:03:56.951Z',
              id: '8989a55c-1f87-404a-8135-58dab5225829',
              _id: 'FfSVdxh6bFjrCZKe',
              createdAt: '2022-07-21T05:03:51.617Z',
              ifShow: true,
              customId: 'node_86392e2f',
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                },
                items: [
                  {
                    customId: 'port_a1e0e149',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'status',
                      type: 'int',
                      require: true,
                      alias: 'status',
                    },
                    color: '#7a3f59',
                    id: '6015e6e3-466d-4099-ae40-413e5e2b4ee4',
                  },
                  {
                    customId: 'port_d5ae06df',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'message',
                      type: 'string',
                      alias: 'message',
                    },
                    color: '#165b5c',
                    id: 'a3a0a2a0-48e1-41c1-93fa-21e92497380f',
                  },
                ],
              },
              position: {
                x: 550.0000000000011,
                y: 1990.0000000000027,
              },
              size: {
                width: 300,
                height: 130,
              },
              dropDownCheckBox: [],
              parent: 'group_490b7b77',
            },
            {
              alias: 'Business_Glue_Station',
              name: 'Business_Glue_Station',
              description: 'This is a business  plugin for Glue station',
              version: '0.0.1',
              buildIn: false,
              useGpu: false,
              category: 'CV',
              config: {
                module: 'CV__C__Business_Glue_Station',
                executor: 'Business_Glue_Station',
                initParams: {
                  glue_width_max: {
                    name: 'glue_width_max',
                    alias: 'glue_width_max',
                    require: false,
                    value: 80,
                    type: 'int',
                    widget: {
                      type: 'InputNumber',
                      max: 300,
                      min: 0,
                      step: 1,
                      precision: 0,
                    },
                  },
                  glue_width_min: {
                    name: 'glue_width_min',
                    alias: 'glue_width_min',
                    require: false,
                    value: 1,
                    type: 'int',
                    widget: {
                      type: 'InputNumber',
                      max: 300,
                      min: 0,
                      step: 1,
                      precision: 0,
                    },
                  },
                },
                input: {
                  srcImg: {
                    type: 'numpy.ndarray',
                    require: true,
                    alias: 'srcImg',
                  },
                  maskImg: {
                    type: 'numpy.ndarray',
                    require: true,
                    alias: 'maskImg',
                  },
                },
                output: {
                  status: {
                    type: 'int',
                    alias: 'status',
                  },
                  showImg: {
                    type: 'numpy.ndarray',
                    alias: 'showImg',
                  },
                },
                group: [],
              },
              author: 'Sany-ShenFei',
              updatedAt: '2022-07-21T05:10:19.588Z',
              id: '00798d3e-b188-4dec-a9bb-094552db721b',
              _id: 'rwz6WHooi52rSoQo',
              createdAt: '2022-07-21T05:00:31.271Z',
              ifShow: true,
              customId: 'node_90cc8e9d',
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                },
                items: [
                  {
                    customId: 'port_491f4c24',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'srcImg',
                      type: 'numpy.ndarray',
                      require: true,
                      alias: 'srcImg',
                    },
                    color: '#1acccf',
                    id: '1a2addf1-bd70-47bd-99dd-c436db43a226',
                  },
                  {
                    customId: 'port_c8b102bf',
                    group: 'top',
                    label: {
                      direction: 'input',
                      name: 'maskImg',
                      type: 'numpy.ndarray',
                      require: true,
                      alias: 'maskImg',
                    },
                    color: '#1acccf',
                    id: '0551c2e5-658e-4cb4-ba93-19afc1f138d1',
                  },
                  {
                    customId: 'port_e1b3adac',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'status',
                      type: 'int',
                      alias: 'status',
                    },
                    color: '#7a3f59',
                    id: 'a7f6b04f-baa7-4a5e-901c-d41889514c80',
                  },
                  {
                    customId: 'port_d4718e1c',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'showImg',
                      type: 'numpy.ndarray',
                      alias: 'showImg',
                    },
                    color: '#1acccf',
                    id: 'ce651fd7-c5f2-4e6b-a719-6f877a53ca65',
                  },
                ],
              },
              position: {
                x: 880.0000000000011,
                y: 1690.0000000000027,
              },
              size: {
                width: 300,
                height: 130,
              },
              dropDownCheckBox: [],
              parent: 'group_490b7b77',
            },
            {
              alias: '服务TCPServer',
              name: 'TcpServer',
              description:
                'TCP服务插件，跟监听指定端口的请求，并根据"默认异常响应信息"和 "异常中断响应表" 进行响应',
              version: '0.0.2',
              buildIn: false,
              useGpu: false,
              category: 'SERV',
              config: {
                module: 'SERV__A__TcpServer',
                executor: 'TcpServer',
                initParams: {
                  port: {
                    name: 'port',
                    alias: 'port',
                    require: true,
                    default: 2000,
                    value: 5547,
                    type: 'int',
                    description: '监听端口',
                    widget: {
                      type: 'InputNumber',
                      max: 65535,
                      min: 1000,
                      step: 1,
                      precision: 0,
                    },
                  },
                  default_res_msg: {
                    name: 'default_res_msg',
                    alias: '默认异常响应信息',
                    require: true,
                    default: 'ERROR',
                    value: 'ERROR',
                    type: 'string',
                    description: '默认异常响应信息',
                    widget: {
                      type: 'Input',
                    },
                  },
                  response_template: {
                    name: 'response_template',
                    alias: '异常中断响应表',
                    require: false,
                    default: '{}',
                    type: 'string',
                    widget: {
                      type: 'codeEditor',
                    },
                    value: '{}',
                  },
                },
                input: {},
                output: {
                  message: {
                    type: 'string',
                    alias: 'message',
                  },
                },
                group: [],
              },
              author: 'liwen',
              repository: 'https://github.com/UBV/TcpServer',
              bugs: 'https://github.com/UBV/TcpServer/issues',
              id: 'bbdd935f-f587-4db9-ad66-f32caec4d18b',
              _id: '1DBwzaY2tR0lAQ2J',
              createdAt: '2022-06-21T10:16:06.395Z',
              updatedAt: '2022-07-14T18:56:31.402Z',
              ifShow: true,
              customId: 'node_45ed4f5c',
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      fo: {
                        r: 6,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                      },
                    },
                  },
                },
                items: [
                  {
                    customId: 'port_688d2b5c',
                    group: 'bottom',
                    label: {
                      direction: 'output',
                      name: 'message',
                      type: 'string',
                      alias: 'message',
                    },
                    color: '#165b5c',
                    id: 'a0ae4b81-5784-4661-b4d5-400266424ccd',
                  },
                ],
              },
              position: {
                x: 600,
                y: 640,
              },
              dropDownCheckBox: [],
              size: {
                width: 300,
                height: 130,
              },
            },
          ],
          edges: [
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#165b5c',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: '31632592-8086-42b8-938a-de01e4ed5ba8',
              parent: 'group_e0278e38',
              data: {
                status: 'STOPPED',
                graphLock: false,
                guid: '4f97ab41',
              },
              source: {
                cell: 'b5fef33b-ede1-4d8a-888c-2bbfce294b98',
                port: '058e4bdb-167e-48f4-9188-3273baff14e4',
              },
              target: {
                cell: 'b78ac9ce-d8f4-4e76-84eb-f38cf12a992a',
                port: 'b97034ff-227c-4f7f-bb0d-8ad3248ba819',
              },
            },
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#165b5c',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: 'daec7b08-45f6-4891-974b-bc9a198a8238',
              parent: 'group_e0278e38',
              data: {
                status: 'STOPPED',
                graphLock: false,
                guid: 'bdd8acb0',
              },
              source: {
                cell: 'a1d8d2a3-3c96-4862-904e-a874bef76a57',
                port: '9591d6e0-64ca-4d8c-b42b-29f439ac3e0f',
              },
              target: {
                cell: 'b5fef33b-ede1-4d8a-888c-2bbfce294b98',
                port: '88ffbb5b-d26a-42d3-9f91-337e0436d92a',
              },
            },
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#1acccf',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: '3b4fd793-123a-440d-ac6a-507e687acfb0',
              parent: 'group_490b7b77',
              data: {
                status: 'STOPPED',
                graphLock: false,
                guid: 'c746c605',
              },
              source: {
                cell: 'c98381bf-8e21-443b-b241-ee8a07d11b7b',
                port: '7961fb07-7eec-443e-91c5-6a3177732566',
              },
              target: {
                cell: '00798d3e-b188-4dec-a9bb-094552db721b',
                port: '1a2addf1-bd70-47bd-99dd-c436db43a226',
              },
            },
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#1acccf',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: '7fc677de-9e0c-4d08-a895-ce783dfe2928',
              data: {
                status: 'STOPPED',
                graphLock: false,
                guid: '68bd30c1',
              },
              parent: 'group_490b7b77',
              source: {
                cell: 'c98381bf-8e21-443b-b241-ee8a07d11b7b',
                port: '7961fb07-7eec-443e-91c5-6a3177732566',
              },
              target: {
                cell: '56284350-1bc5-465f-b7d4-2c7fbe94097d',
                port: '7c77e391-3961-4bbb-b009-a347149b449e',
              },
            },
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#165b5c',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: 'b935179d-0abb-4141-9eee-313fe6d07003',
              data: {
                status: 'STOPPED',
                graphLock: false,
                guid: 'c285aaf4',
              },
              parent: 'group_490b7b77',
              source: {
                cell: 'c98381bf-8e21-443b-b241-ee8a07d11b7b',
                port: '51510414-8a0c-49f6-a6b0-3eec528bed65',
              },
              target: {
                cell: '56284350-1bc5-465f-b7d4-2c7fbe94097d',
                port: 'c74b7ffb-9cab-4583-92ec-9700ce552318',
              },
            },
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#1acccf',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: 'da5b3fdd-f8da-4b6a-9e21-bbbbe388d722',
              data: {
                status: 'STOPPED',
                graphLock: false,
                guid: 'c002a448',
              },
              parent: 'group_490b7b77',
              source: {
                cell: 'c98381bf-8e21-443b-b241-ee8a07d11b7b',
                port: '7961fb07-7eec-443e-91c5-6a3177732566',
              },
              target: {
                cell: '1f90147b-c49c-4884-803f-1c97f9824655',
                port: '32f85b78-82b7-4bd8-b2c9-43a3a5a7903f',
              },
            },
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#165b5c',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: '1bd00053-dd11-43d7-bb29-be47cbb15b3f',
              source: {
                cell: '3e41e3d3-2ef4-44fc-9771-d352e634dfdf',
                port: 'c2aeed53-807a-49ea-b265-6f0f206064d6',
              },
              target: {
                cell: 'c98381bf-8e21-443b-b241-ee8a07d11b7b',
                port: '8c3b5c46-5934-496d-ac5f-d8b1ca403188',
              },
            },
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#7a3f59',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: '957cb389-aa29-42f7-b182-ea918580d9b0',
              data: {
                status: 'STOPPED',
                graphLock: false,
                guid: 'f303258c',
              },
              parent: 'group_490b7b77',
              source: {
                cell: '00798d3e-b188-4dec-a9bb-094552db721b',
                port: 'a7f6b04f-baa7-4a5e-901c-d41889514c80',
              },
              target: {
                cell: '8989a55c-1f87-404a-8135-58dab5225829',
                port: '6015e6e3-466d-4099-ae40-413e5e2b4ee4',
              },
            },
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#1acccf',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: 'a367cd6d-29d2-4df9-9e78-b1b05a6286a8',
              data: {
                status: 'STOPPED',
                graphLock: false,
                guid: '669c38bd',
              },
              parent: 'group_490b7b77',
              source: {
                cell: '00798d3e-b188-4dec-a9bb-094552db721b',
                port: 'ce651fd7-c5f2-4e6b-a719-6f877a53ca65',
              },
              target: {
                cell: '45e063e4-8d3e-4e10-a1cd-48be2f78e97a',
                port: '71cb731c-4648-41d6-933a-946f2a0db521',
              },
            },
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#7a3f59',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: '79727e41-f91a-42af-8610-bf695d1d5bab',
              data: {
                status: 'STOPPED',
                graphLock: false,
                guid: 'c88e20bc',
              },
              parent: 'group_490b7b77',
              source: {
                cell: '00798d3e-b188-4dec-a9bb-094552db721b',
                port: 'a7f6b04f-baa7-4a5e-901c-d41889514c80',
              },
              target: {
                cell: 'dc4e22e5-a1fe-4d99-9f2b-01367e813b1b',
                port: '91a87f00-4441-4857-8dae-dfc363367917',
              },
            },
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#1acccf',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: '198f0bee-a079-4393-a218-eff672ec0e45',
              data: {
                status: 'STOPPED',
                graphLock: false,
                guid: '14f3b8d0',
              },
              parent: 'group_490b7b77',
              source: {
                cell: '1f90147b-c49c-4884-803f-1c97f9824655',
                port: '3419b89d-70be-479c-9877-75ce3bcfdf98',
              },
              target: {
                cell: '00798d3e-b188-4dec-a9bb-094552db721b',
                port: '0551c2e5-658e-4cb4-ba93-19afc1f138d1',
              },
            },
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#165b5c',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: 'b46c8c19-0e51-48a0-8aca-c194b6478543',
              data: {
                status: 'STOPPED',
                graphLock: false,
                guid: 'fb78dabc',
              },
              parent: 'group_490b7b77',
              source: {
                cell: '8989a55c-1f87-404a-8135-58dab5225829',
                port: 'a3a0a2a0-48e1-41c1-93fa-21e92497380f',
              },
              target: {
                cell: 'b4f890bc-3254-4e03-a4bb-7e16b8d5534d',
                port: 'b6e929c7-606a-477d-9de1-9c5751936aca',
              },
            },
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#165b5c',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: '83b3763e-8da2-4e7e-ae9e-d57b4bc9c113',
              data: {
                status: 'STOPPED',
                graphLock: false,
                guid: 'e4af8da9',
              },
              parent: 'group_490b7b77',
              source: {
                cell: '45e063e4-8d3e-4e10-a1cd-48be2f78e97a',
                port: '5c66b076-ef20-4c1e-8c41-683c8ba170b2',
              },
              target: {
                cell: 'dc4e22e5-a1fe-4d99-9f2b-01367e813b1b',
                port: '2712f986-c147-49dc-8f9a-ffd4a6f07f90',
              },
            },
            {
              shape: 'dag-edge',
              attrs: {
                line: {
                  stroke: '#165b5c',
                  strokeWidth: 6,
                  strokeDasharray: '',
                },
              },
              zIndex: 0,
              id: '4c9746a9-80ec-49af-aeeb-68f273ee6346',
              source: {
                cell: 'bbdd935f-f587-4db9-ad66-f32caec4d18b',
                port: 'a0ae4b81-5784-4661-b4d5-400266424ccd',
              },
              target: {
                cell: '3e41e3d3-2ef4-44fc-9771-d352e634dfdf',
                port: '627134a1-328f-4aa2-8125-efef9f5b23ec',
              },
            },
          ],
        },
        commonInfo: {
          productionInfo: '涂布机正极',
          stationInfo: '工位1A面',
          useInfo: '尺寸测量与缺陷检测',
        },
        contentData: {
          home: [
            { i: 'slider-1', x: 0, y: 0, w: 2, h: 4, minW: 1, maxW: 12, minH: 2, maxH: 30 },
            { i: 'slider-2', x: 0, y: 4, w: 2, h: 9, minW: 1, maxW: 12, minH: 2, maxH: 30 },
            { i: 'slider-3', x: 0, y: 15, w: 0, h: 0, minW: 0, maxW: 12, minH: 0, maxH: 30 },
            { i: 'footer-1', x: 2, y: 14, w: 10, h: 4, minW: 1, maxW: 12, minH: 2, maxH: 30 },
            { i: 'footer-2', x: 0, y: 13, w: 2, h: 5, minW: 1, maxW: 12, minH: 2, maxH: 30 },
          ],
          content: {
            '45e063e4-8d3e-4e10-a1cd-48be2f78e97a': {
              value: ['45e063e4-8d3e-4e10-a1cd-48be2f78e97a', 'store_path'],
              type: 'alert',
              size: {
                i: '45e063e4-8d3e-4e10-a1cd-48be2f78e97a',
                x: 2,
                y: 0,
                w: 5,
                h: 8,
                minW: 1,
                maxW: 12,
                minH: 2,
                maxH: 30,
              },
            },
            'b4f890bc-3254-4e03-a4bb-7e16b8d5534d': {
              value: ['b4f890bc-3254-4e03-a4bb-7e16b8d5534d'],
              size: {
                i: 'b4f890bc-3254-4e03-a4bb-7e16b8d5534d',
                x: 2,
                y: 8,
                w: 5,
                h: 6,
                minW: 1,
                maxW: 12,
                minH: 2,
                maxH: 30,
              },
              type: 'bar',
              tab: '1',
              yName: 'qwe',
              xName: 'asd',
            },
            '56284350-1bc5-465f-b7d4-2c7fbe94097d': {
              value: ['56284350-1bc5-465f-b7d4-2c7fbe94097d', 'store_path'],
              size: {
                i: '56284350-1bc5-465f-b7d4-2c7fbe94097d',
                x: 7,
                y: 0,
                w: 5,
                h: 8,
                minW: 1,
                maxW: 12,
                minH: 2,
                maxH: 30,
              },
              type: 'point',
              tab: '1',
              yName: '123',
              xName: 'sdf',
            },
            '3e41e3d3-2ef4-44fc-9771-d352e634dfdf': {
              value: ['3e41e3d3-2ef4-44fc-9771-d352e634dfdf', 'heart'],
              size: {
                i: '3e41e3d3-2ef4-44fc-9771-d352e634dfdf',
                x: 7,
                y: 8,
                w: 5,
                h: 6,
                minW: 1,
                maxW: 12,
                minH: 2,
                maxH: 30,
              },
              type: 'line',
              tab: '1',
              yName: 'sdfdfv',
              xName: 'r5y4gr',
            },
          },
          footerSelectList: ['45e063e4-8d3e-4e10-a1cd-48be2f78e97a'],
        },
        environment: {
          serviceIp: 'localhost',
          servicePort: '18080',
        },
        project_id: '9560c0ea',
      },
    ],
  });
};

const getParams = (req: Request, res: Response) => {
  res.json({
    code: 'SUCCESS',
    msg: '',
    data: { "id": "b64512e", "name": "FDX_GLUE_正式", "description": "分动箱涂胶", "plugin_path": "/opt/ubvision/tujiao/plugins", "zoom": 0.4200913242009132, "graphLock": false, "position": { "x": 967.2173913043479, "y": -609.9999999999999 }, "flowData": { "groups": [{ "position": { "x": 310, "y": 580 }, "size": { "width": 1720, "height": 280 }, "attrs": { "body": { "fill": "#2E394D" }, "buttonSign": { "d": "M 2 5 8 5" }, "label": { "text": "group_6a56067b" } }, "id": "group_6a56067b", "shape": "dag-group", "customId": "group_6a56067b", "childrenList": ["3e41e3d3-2ef4-44fc-9771-d352e634dfdf"], "zIndex": 0, "children": ["3e41e3d3-2ef4-44fc-9771-d352e634dfdf"], "originPosition": { "x": 310, "y": 580 }, "originSize": { "width": 1720, "height": 280 } }, { "position": { "x": -340, "y": 1100 }, "size": { "width": 440, "height": 1120 }, "attrs": { "body": { "fill": "#2E394D" }, "buttonSign": { "d": "M 2 5 8 5" }, "label": { "text": "group_e0278e38" } }, "id": "group_e0278e38", "shape": "dag-group", "customId": "group_e0278e38", "childrenList": ["b78ac9ce-d8f4-4e76-84eb-f38cf12a992a", "a1d8d2a3-3c96-4862-904e-a874bef76a57", "b5fef33b-ede1-4d8a-888c-2bbfce294b98"], "zIndex": 0, "children": ["b78ac9ce-d8f4-4e76-84eb-f38cf12a992a", "a1d8d2a3-3c96-4862-904e-a874bef76a57", "b5fef33b-ede1-4d8a-888c-2bbfce294b98"], "originPosition": { "x": -340, "y": 1100 }, "originSize": { "width": 440, "height": 1100 } }, { "position": { "x": 320, "y": 1020 }, "size": { "width": 1770, "height": 1810 }, "attrs": { "body": { "fill": "#2E394D" }, "buttonSign": { "d": "M 2 5 8 5" }, "label": { "text": "group_490b7b77" } }, "id": "group_490b7b77", "shape": "dag-group", "customId": "group_490b7b77", "childrenList": ["c98381bf-8e21-443b-b241-ee8a07d11b7b", "00798d3e-b188-4dec-a9bb-094552db721b", "8989a55c-1f87-404a-8135-58dab5225829", "b4f890bc-3254-4e03-a4bb-7e16b8d5534d", "45e063e4-8d3e-4e10-a1cd-48be2f78e97a", "56284350-1bc5-465f-b7d4-2c7fbe94097d", "1f90147b-c49c-4884-803f-1c97f9824655", "dc4e22e5-a1fe-4d99-9f2b-01367e813b1b"], "zIndex": 0, "children": ["c98381bf-8e21-443b-b241-ee8a07d11b7b", "00798d3e-b188-4dec-a9bb-094552db721b", "8989a55c-1f87-404a-8135-58dab5225829", "b4f890bc-3254-4e03-a4bb-7e16b8d5534d", "45e063e4-8d3e-4e10-a1cd-48be2f78e97a", "56284350-1bc5-465f-b7d4-2c7fbe94097d", "1f90147b-c49c-4884-803f-1c97f9824655", "dc4e22e5-a1fe-4d99-9f2b-01367e813b1b"], "originPosition": { "x": 320, "y": 1020 }, "originSize": { "width": 1770, "height": 1810 } }], "nodes": [{ "name": "LogAnalyzer", "alias": "日志分析Analyzer", "version": "2.0.0", "id": "45e063e4-8e3e-4e10-a1cd-48be6g78e97a", "category": "Callback", "description": "用于ubv运行日志分析，目前仅支持耗时分析，后续版本将加入异常分析等功能", "author": "liwen", "config": { "module": "B__LogAnalyzer", "executor": "LogAnalyzer", "initParams": { "log_file": { "name": "log_file", "alias": "日志文件", "orderId": 0, "require": true, "default": "", "type": "File", "widget": { "type": "File", "id": "log_file", "suffix": ["log"] } }, "start_time": { "name": "start_time", "alias": "开始时间", "orderId": 1, "require": false, "default": 0, "value": 0, "type": "int", "widget": { "type": "DatePicker" } }, "end_time": { "name": "end_time", "alias": "结束时间", "orderId": 2, "require": false, "default": 1691027321043, "value": 1691027321043, "type": "int", "widget": { "type": "DatePicker" } } }, "execParams": { "log_file": { "name": "log_file", "alias": "日志文件", "orderId": 0, "require": true, "default": "", "type": "File", "widget": { "type": "File", "id": "log_file", "suffix": ["log"] } }, "start_time": { "name": "start_time", "alias": "开始时间", "orderId": 1, "require": false, "default": 0, "value": 0, "type": "int", "widget": { "type": "DatePicker" } }, "end_time": { "name": "end_time", "alias": "结束时间", "orderId": 2, "require": false, "default": 1691027321043, "value": 1691027321043, "type": "int", "widget": { "type": "DatePicker" } } }, "input": { "cond": { "type": "dict", "require": true, "alias": "执行信息" } }, "output": { "data": { "type": "list", "alias": "data" }, "percent": { "type": "list", "alias": "percent" }, "trend_data": { "type": "list", "alias": "趋势数据" } }, "group": [] }, "buildIn": false }, { "name": "ImageStorge", "version": "0.0.2", "category": "DS", "description": "This is a DataStorage plugin", "author": "liwen", "config": { "module": "DS__A__ImageStorge", "executor": "ImageStorge", "initParams": { "store_dir": { "name": "store_dir", "alias": "存图目录", "require": true, "onHidden": true, "default": "/tmp/ubvision", "value": "/data/pangu-fs/track-inspect", "type": "Dir", "description": "选择一个存图目录", "widget": { "type": "Dir" } }, "target_format": { "name": "target_format", "alias": "存图格式", "require": true, "default": "jpg", "value": ".jpg", "type": "List[string]", "widget": { "type": "Radio", "options": [".jpg", ".png", ".bmp"] } }, "platForm_723b3e19": { "name": "platForm_723b3e19", "alias": "platForm_723b3e19", "orderId": 5, "require": false, "default": "/Users/wilr/Downloads/201656991026_.pic_hd.jpg", "localPath": "https://seopic.699pic.com/photo/40015/5662.jpg_wh1201.jpg", "type": "File", "description": "标注", "widget": { "type": "ImageLabelField", "options": { "horizontal_electrode": { "measurement": { "id": "Measurement_f6c171ac", "name": "Measurement_f6c171ac", "alias": "Measurement_f6c171ac", "orderId": 1, "require": false, "default": { "标准值": { "alias": "标准值", "value": 1 }, "正公差": { "alias": "正公差", "value": 2 }, "负公差": { "alias": "负公差", "value": 3 }, "补偿值": { "alias": "补偿值", "value": 4 } }, "value": { "标准值": { "alias": "标准值", "value": 1 }, "正公差": { "alias": "正公差", "value": 2 }, "负公差": { "alias": "负公差", "value": 3 }, "补偿值": { "alias": "补偿值", "value": 4 } }, "type": "float", "widget": { "type": "Measurement" } }, "gradient_threshold": { "name": "gradient_threshold", "alias": "gradient_threshold", "require": true, "default": 15, "value": 15, "type": "int", "description": "数值", "widget": { "type": "InputNumber", "max": 99999, "min": 0, "step": 1 } }, "search_direction": { "name": "search_direction", "alias": "search_direction", "require": true, "default": 0, "value": 0, "type": "int", "description": "数值", "widget": { "type": "InputNumber", "max": 99999, "min": 0, "step": 1 } }, "change_mode": { "name": "search_direction", "alias": "search_direction", "require": true, "default": 2, "value": 2, "type": "int", "description": "数值", "widget": { "type": "InputNumber", "max": 99999, "min": 0, "step": 1 } } }, "horizontal_diaphram": { "measurement": { "id": "Measurement_f6c171ac", "name": "Measurement_f6c171ac", "alias": "Measurement_f6c171ac", "orderId": 1, "require": false, "default": { "标准值": { "alias": "标准值", "value": 1 }, "正公差": { "alias": "正公差", "value": 2 }, "负公差": { "alias": "负公差", "value": 3 }, "补偿值": { "alias": "补偿值", "value": 4 } }, "value": { "标准值": { "alias": "标准值", "value": 1 }, "正公差": { "alias": "正公差", "value": 2 }, "负公差": { "alias": "负公差", "value": 3 }, "补偿值": { "alias": "补偿值", "value": 4 } }, "type": "float", "widget": { "type": "Measurement" } }, "gradient_threshold": { "name": "gradient_threshold", "alias": "gradient_threshold", "require": true, "default": 16, "value": 16, "type": "int", "description": "数值", "widget": { "type": "InputNumber", "max": 99999, "min": 0, "step": 1 } }, "search_direction": { "name": "search_direction", "alias": "search_direction", "require": true, "default": 0, "value": 1, "type": "int", "description": "数值", "widget": { "type": "InputNumber", "max": 99999, "min": 0, "step": 1 } }, "change_mode": { "name": "search_direction", "alias": "search_direction", "require": true, "default": 1, "value": 1, "type": "int", "description": "数值", "widget": { "type": "InputNumber", "max": 99999, "min": 0, "step": 1 } } }, "vertical_electrode": { "measurement": { "id": "Measurement_f6c171ac", "name": "Measurement_f6c171ac", "alias": "Measurement_f6c171ac", "orderId": 1, "require": false, "default": { "标准值": { "alias": "标准值", "value": 1 }, "正公差": { "alias": "正公差", "value": 2 }, "负公差": { "alias": "负公差", "value": 3 }, "补偿值": { "alias": "补偿值", "value": 4 } }, "value": { "标准值": { "alias": "标准值", "value": 1 }, "正公差": { "alias": "正公差", "value": 2 }, "负公差": { "alias": "负公差", "value": 3 }, "补偿值": { "alias": "补偿值", "value": 4 } }, "type": "float", "widget": { "type": "Measurement" } }, "gradient_threshold": { "name": "gradient_threshold", "alias": "gradient_threshold", "require": true, "default": 18, "value": 18, "type": "int", "description": "数值", "widget": { "type": "InputNumber", "max": 99999, "min": 0, "step": 1 } }, "search_direction": { "name": "search_direction", "alias": "search_direction", "require": true, "default": 0, "value": 0, "type": "int", "description": "数值", "widget": { "type": "InputNumber", "max": 99999, "min": 0, "step": 1 } }, "change_mode": { "name": "search_direction", "alias": "search_direction", "require": true, "default": 3, "value": 3, "type": "int", "description": "数值", "widget": { "type": "InputNumber", "max": 99999, "min": 0, "step": 1 } } } } } }, "platForm_7223e19": { "name": "platForm_7223e19", "alias": "platForm_7223e19", "orderId": 5, "require": false, "default": "/Users/wilr/Downloads/201656991026_.pic_hd.jpg", "localPath": "https://seopic.699pic.com/photo/40015/5662.jpg_wh1200.jpg", "type": "File", "description": "标注", "widget": { "type": "ImageLabelField", "id": "platForm_723b3e19" } } }, "input": { "src_img": { "type": "numpy.ndarray", "require": true, "alias": "src_img" }, "category": { "type": "string", "require": false, "alias": "category" }, "img_name": { "type": "string", "require": false, "alias": "img_name" } }, "output": { "status": { "type": "bool", "alias": "status123123123qwe" }, "category": { "type": "string", "alias": "category" }, "store_path": { "type": "string", "alias": "store_path" } } }, "alias": "图片存储器ImgStorge", "buildIn": false, "useGpu": false, "id": "45e063e4-8d3e-4e10-a1cd-48be2f78e97a", "_id": "SNF8MEF6cMipAYTE", "createdAt": "2022-06-21T10:15:17.282Z", "updatedAt": "2022-06-21T10:17:15.705Z", "ifShow": true, "customId": "node_d732fd33", "ports": { "groups": { "top": { "position": "top", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } }, "bottom": { "position": "bottom", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } } }, "items": [{ "customId": "port_1f452085", "group": "top", "label": { "direction": "input", "name": "src_img", "type": "numpy.ndarray", "require": true, "alias": "src_img" }, "color": "#1acccf", "id": "71cb731c-4648-41d6-933a-946f2a0db521" }, { "customId": "port_ac4beda0", "group": "top", "label": { "direction": "input", "name": "category", "type": "string", "require": false, "alias": "category" }, "color": "#165b5c", "id": "e5d20ecc-b2dc-4d2f-a7b4-bf0ecc1bcaa6" }, { "customId": "port_b1ee47eb", "group": "top", "label": { "direction": "input", "name": "img_name", "type": "string", "require": false, "alias": "img_name" }, "color": "#165b5c", "id": "e7e1dabe-8ba7-4c39-a787-f0fbbcd4cfba" }, { "customId": "port_b86c9517", "group": "bottom", "label": { "direction": "output", "name": "status", "type": "bool", "alias": "status" }, "color": "#7d573a", "id": "f409838a-abbb-4f7e-8e14-98432257447a" }, { "customId": "port_1a110c28", "group": "bottom", "label": { "direction": "output", "name": "category", "type": "string", "alias": "category" }, "color": "#165b5c", "id": "d87d04e9-331f-4334-922d-6c826211a848" }, { "customId": "port_508b1d0d", "group": "bottom", "label": { "direction": "output", "name": "store_path", "type": "string", "alias": "store_path" }, "color": "#165b5c", "id": "5c66b076-ef20-4c1e-8c41-683c8ba170b2" }] }, "position": { "x": 1060.0000000000011, "y": 2000.0000000000027 }, "dropDownCheckBox": ["result"], "size": { "width": 480, "height": 370 }, "parent": "group_490b7b77" }, { "name": "ImageStorge.json", "version": "0.0.2", "category": "DS", "description": "This is a DataStorage plugin", "author": "liwen", "config": { "module": "DS__A__ImageStorge", "executor": "ImageStorge", "initParams": { "store_dir": { "name": "store_dir", "alias": "存图目录", "require": true, "onHidden": true, "default": "/tmp/ubvision", "value": "/data/simulate/images", "type": "Dir", "description": "选择一个存图目录", "widget": { "type": "Dir" } }, "target_format": { "name": "target_format", "alias": "存图格式", "require": true, "default": "jpg", "value": ".jpg", "type": "List[string]", "widget": { "type": "Radio", "options": [".jpg", ".png", ".bmp"] } } }, "input": { "src_img": { "type": "numpy.ndarray", "require": true, "alias": "src_img" }, "category": { "type": "string", "require": false, "alias": "category" }, "img_name": { "type": "string", "require": false, "alias": "img_name" } }, "output": { "status": { "type": "bool", "alias": "status" }, "category": { "type": "string", "alias": "category" }, "store_path": { "type": "string", "alias": "store_path" } }, "group": [] }, "alias": "图片存储器ImgStorge.json", "buildIn": false, "useGpu": false, "id": "56284350-1bc5-465f-b7d4-2c7fbe94097d", "_id": "SNF8MEF6cMipAYTE", "createdAt": "2022-06-21T10:15:17.282Z", "updatedAt": "2022-07-13T11:02:57.716Z", "ifShow": true, "customId": "node_5f987d1b", "ports": { "groups": { "top": { "position": "top", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } }, "bottom": { "position": "bottom", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } } }, "items": [{ "customId": "port_b3a9431b", "group": "top", "label": { "direction": "input", "name": "src_img", "type": "numpy.ndarray", "require": true, "alias": "src_img" }, "color": "#1acccf", "id": "7c77e391-3961-4bbb-b009-a347149b449e" }, { "customId": "port_264baf3a", "group": "top", "label": { "direction": "input", "name": "category", "type": "string", "require": false, "alias": "category" }, "color": "#165b5c", "id": "c74b7ffb-9cab-4583-92ec-9700ce552318" }, { "customId": "port_0ddb2da7", "group": "top", "label": { "direction": "input", "name": "img_name", "type": "string", "require": false, "alias": "img_name" }, "color": "#165b5c", "id": "9c65211b-8867-4cb5-8f39-8a21cee512ce" }, { "customId": "port_4f452295", "group": "bottom", "label": { "direction": "output", "name": "status", "type": "bool", "alias": "status" }, "color": "#7d573a", "id": "5bdac4c1-3403-47c9-b7a4-7e5fb789559b" }, { "customId": "port_a20d197c", "group": "bottom", "label": { "direction": "output", "name": "category", "type": "string", "alias": "category" }, "color": "#165b5c", "id": "28eae3a6-f1d8-4e16-88c9-6e385cac052f" }, { "customId": "port_854a6544", "group": "bottom", "label": { "direction": "output", "name": "store_path", "type": "string", "alias": "store_path" }, "color": "#165b5c", "id": "14306f65-e705-4ca7-8769-cc093726a35c" }] }, "position": { "x": 830.0000000000011, "y": 1370.0000000000027 }, "size": { "width": 444, "height": 130 }, "dropDownCheckBox": ["result"], "parent": "group_490b7b77" }, { "name": "Responser.json", "version": "0.0.1", "category": "COMM", "description": "This is COMM Responser", "author": "lw-Sany", "repository": "https://github.com/UBV/ResultParser", "bugs": "https://github.com/UBV/ResultParser/issues", "config": { "module": "COMM__A__Responser", "executor": "Responser", "initParams": { "respond_to": { "name": "respond_to", "alias": "respond_to", "require": false, "type": "string", "widget": { "type": "Input" }, "value": "1fbf97c8-d887-43a5-8f2c-ed198e098b8b" } }, "input": { "response": { "type": "string", "require": true, "alias": "response" } }, "output": {} }, "alias": "TCP-Responser.json", "buildIn": false, "useGpu": false, "codeEditor": false, "id": "b4f890bc-3254-4e03-a4bb-7e16b8d5534d", "_id": "IIPdi27QjBzC76Ag", "createdAt": "2022-06-05T15:14:02.102Z", "updatedAt": "2022-07-13T11:03:30.387Z", "ifShow": true, "customId": "node_bf76a6ee", "ports": { "groups": { "top": { "position": "top", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } }, "bottom": { "position": "bottom", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } } }, "items": [{ "customId": "port_7987924e", "group": "top", "label": { "direction": "input", "name": "response", "type": "string", "require": true, "alias": "response" }, "color": "#165b5c", "id": "b6e929c7-606a-477d-9de1-9c5751936aca" }] }, "position": { "x": 540.0000000000011, "y": 2280.0000000000027 }, "size": { "width": 300, "height": 130 }, "dropDownCheckBox": [], "parent": "group_490b7b77" }, { "name": "Glue_Trigger_Parser", "version": "1.0.0", "category": "TOOL", "description": "TOOL__C__Glue_Trigger_Parser", "author": "sf-Sany", "config": { "module": "TOOL__C__Glue_Trigger_Parser", "executor": "parse", "initParams": {}, "input": { "origin_str": { "type": "string", "require": true, "alias": "origin_str" } }, "output": { "camera": { "type": "string", "alias": "camera" }, "heart": { "type": "string", "alias": "heart" } }, "group": [] }, "updatedAt": "2022-07-13T13:14:32.108Z", "id": "3e41e3d3-2ef4-44fc-9771-d352e634dfdf", "_id": "cONUuPsSLoL8Rx5F", "createdAt": "2022-07-13T13:14:24.753Z", "alias": "Glue_Trigger_Parser", "buildIn": false, "useGpu": false, "ifShow": true, "customId": "node_d2946b47", "ports": { "groups": { "top": { "position": "top", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } }, "bottom": { "position": "bottom", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } } }, "items": [{ "customId": "port_57fac917", "group": "top", "label": { "direction": "input", "name": "origin_str", "type": "string", "require": true, "alias": "origin_str" }, "color": "#165b5c", "id": "627134a1-328f-4aa2-8125-efef9f5b23ec" }, { "customId": "port_b8f22edb", "group": "bottom", "label": { "direction": "output", "name": "camera", "type": "string", "alias": "camera" }, "color": "#165b5c", "id": "c2aeed53-807a-49ea-b265-6f0f206064d6" }, { "customId": "port_0c5a998c", "group": "bottom", "label": { "direction": "output", "name": "heart", "type": "string", "alias": "heart" }, "color": "#165b5c", "id": "8852db72-a768-43d3-b57d-be7443a0202b" }] }, "position": { "x": 1380, "y": 650.0000000000003 }, "size": { "width": 300, "height": 130 }, "dropDownCheckBox": [], "parent": "group_6a56067b" }, { "alias": "AIEngine", "name": "AIEngine", "description": "This is an ai engine plugin for industrial visual quality inspection\n2022.7.1", "version": "0.1.0", "buildIn": false, "useGpu": true, "category": "CV", "config": { "module": "CV__B__AIEngine", "executor": "AIEngine", "initParams": { "config_path": { "name": "config_path", "alias": "config_path", "require": false, "type": "File", "widget": { "type": "File", "suffix": [".jpg/.jpeg", ".png", ".svg", ".pdf", ".pt", ".py", ".doc/.docx", ".csv", ".bmp", ".json", "all"] }, "value": "/opt/ubvision/tujiao/resources/configs/seg_swin_transformer_st_tujiao.json" }, "model_path": { "name": "model_path", "alias": "model_path", "require": false, "type": "File", "widget": { "type": "File", "suffix": [".jpg/.jpeg", ".png", ".svg", ".pdf", ".pt", ".py", ".doc/.docx", ".csv", ".bmp", ".json", "all"] }, "value": "/opt/ubvision/tujiao/resources/models/iter_44000_w1024xh1024_sim_fp32.engine" } }, "input": { "srcImg": { "type": "numpy.ndarray", "require": true, "alias": "srcImg" } }, "output": { "class_name": { "type": "list", "alias": "class_name" }, "masks": { "type": "numpy.ndarray", "alias": "masks" }, "shapes": { "type": "dict", "alias": "shapes" }, "status": { "type": "bool", "alias": "status" } }, "group": [] }, "author": "zwt-Sany", "repository": "https://github.com/QIVG/AlgorithmPluginDemo", "bugs": "https://github.com/QIVG/AlgorithmPluginDemo/issues", "_id": "Ug3bhG8x9kYJHpGM", "createdAt": "2022-06-17T13:08:34.434Z", "updatedAt": "2022-07-14T18:56:31.404Z", "id": "1f90147b-c49c-4884-803f-1c97f9824655", "ifShow": true, "customId": "node_84079990", "ports": { "groups": { "top": { "position": "top", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } }, "bottom": { "position": "bottom", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } } }, "items": [{ "customId": "port_c79f6953", "group": "top", "label": { "direction": "input", "name": "srcImg", "type": "numpy.ndarray", "require": true, "alias": "srcImg" }, "color": "#1acccf", "id": "32f85b78-82b7-4bd8-b2c9-43a3a5a7903f" }, { "customId": "port_e9d93c82", "group": "bottom", "label": { "direction": "output", "name": "class_name", "type": "list", "alias": "class_name" }, "color": "#694256", "id": "ffde9a57-9e5b-43a2-aeef-47e4f0fb0c8e" }, { "customId": "port_5d4da216", "group": "bottom", "label": { "direction": "output", "name": "masks", "type": "numpy.ndarray", "alias": "masks" }, "color": "#1acccf", "id": "3419b89d-70be-479c-9877-75ce3bcfdf98" }, { "customId": "port_7d268669", "group": "bottom", "label": { "direction": "output", "name": "shapes", "type": "dict", "alias": "shapes" }, "color": "#425e7e", "id": "a9186b9f-850a-4a0b-8eb2-aa9ad5ee9c6d" }, { "customId": "port_369b74fd", "group": "bottom", "label": { "direction": "output", "name": "status", "type": "bool", "alias": "status" }, "color": "#7d573a", "id": "d6bdeada-adea-41de-8f90-426e5c945318" }] }, "position": { "x": 1380.0000000000011, "y": 1350.0000000000027 }, "size": { "width": 592, "height": 130 }, "dropDownCheckBox": [], "parent": "group_490b7b77" }, { "alias": "GalaxyCamera", "name": "GalaxyCamera", "description": "GalaxyCamera", "version": "0.1.0", "buildIn": false, "useGpu": false, "category": "CAPTURE", "config": { "module": "CAPTURE__B__GalaxyCamera", "executor": "Camera", "initParams": { "camera_name": { "name": "camera_name", "alias": "camera_name", "require": false, "default": "DefaultCam", "value": "DefaultCam", "type": "string", "widget": { "type": "Input" } }, "serial_number": { "name": "serial_number", "alias": "serial_number", "require": true, "default": " ", "value": "LT0210051918", "type": "string", "widget": { "type": "Input" } }, "exposure_time": { "name": "exposure_time", "alias": "exposure_time", "require": true, "default": 5000, "value": 1500, "type": "int", "widget": { "type": "InputNumber", "max": 100000, "min": 500, "step": 100, "precision": 0 } }, "data_format": { "name": "data_format", "alias": "data_format", "require": false, "default": "RGB", "value": "RGB", "type": "List[string]", "widget": { "type": "Radio", "options": ["RGB", "GRAY", "RAW"] } }, "interval_time": { "name": "interval_time", "alias": "interval_time", "require": true, "default": 0, "type": "float", "widget": { "type": "InputNumber", "max": 5, "min": 0, "step": 0.05, "precision": 2 }, "value": 0.1 }, "width": { "type": "float", "default": 2048, "require": false, "widget": { "type": "InputNumber", "max": 6000, "min": 100, "step": 1, "precision": 1 }, "value": 5496, "alias": "width", "name": "width" }, "height": { "type": "float", "default": 2048, "require": false, "widget": { "type": "InputNumber", "max": 6000, "min": 100, "step": 1, "precision": 1 }, "value": 3672, "alias": "height", "name": "height" }, "DEV_MAPPER": { "type": "str", "default": "/dev/bus/usb", "value": "/dev/bus/usb", "require": true, "widget": { "type": "Input" }, "alias": "DEV_MAPPER", "name": "DEV_MAPPER" }, "NETWORKMODE": { "default": "host", "require": true, "value": "host", "type": "List[string]", "widget": { "type": "Radio", "options": ["host", "bridge"] }, "alias": "NETWORKMODE", "name": "NETWORKMODE" }, "Gain": { "name": "Gain", "alias": "Gain", "require": true, "default": 10, "value": 10, "type": "float", "widget": { "type": "Slider", "max": 20, "min": 0.1, "step": 0.1 } } }, "input": { "signal": { "type": "string", "require": true, "alias": "signal" } }, "output": { "frame": { "type": "numpy.ndarray", "alias": "frame" }, "category": { "type": "string", "alias": "category" }, "status": { "type": "bool", "alias": "status" } }, "group": [{ "id": "76a2eea9", "open": false, "children": ["NETWORKMODE", "DEV_MAPPER"], "name": "Advanced Options" }] }, "author": "liwen", "_id": "UEpwqYTvke6un0Rs", "createdAt": "2022-07-10T03:06:07.682Z", "updatedAt": "2022-07-15T07:45:51.867Z", "id": "c98381bf-8e21-443b-b241-ee8a07d11b7b", "ifShow": true, "customId": "node_0bb7ada6", "ports": { "groups": { "top": { "position": "top", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } }, "bottom": { "position": "bottom", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } } }, "items": [{ "customId": "port_b776d46c", "group": "top", "label": { "direction": "input", "name": "signal", "type": "string", "require": true, "alias": "signal" }, "color": "#165b5c", "id": "8c3b5c46-5934-496d-ac5f-d8b1ca403188" }, { "customId": "port_42c40766", "group": "bottom", "label": { "direction": "output", "name": "frame", "type": "numpy.ndarray", "alias": "frame" }, "color": "#1acccf", "id": "7961fb07-7eec-443e-91c5-6a3177732566" }, { "customId": "port_a7b8fbcc", "group": "bottom", "label": { "direction": "output", "name": "category", "type": "string", "alias": "category" }, "color": "#165b5c", "id": "51510414-8a0c-49f6-a6b0-3eec528bed65" }, { "customId": "port_ddc16065", "group": "bottom", "label": { "direction": "output", "name": "status", "type": "bool", "alias": "status" }, "color": "#7d573a", "id": "7837188d-ec7e-440a-b1d1-396334560acf" }] }, "position": { "x": 810.0000000000011, "y": 1060.0000000000027 }, "size": { "width": 444, "height": 130 }, "dropDownCheckBox": [], "parent": "group_490b7b77" }, { "alias": "服务TCPServer", "name": "TcpServer", "description": "TCP服务插件，跟监听指定端口的请求，并根据\"默认异常响应信息\"和 \"异常中断响应表\" 进行响应", "version": "0.0.2", "buildIn": false, "useGpu": false, "category": "SERV", "config": { "module": "SERV__A__TcpServer", "executor": "TcpServer", "initParams": { "port": { "name": "port", "alias": "port", "require": true, "default": 2000, "value": 5546, "type": "int", "description": "监听端口", "widget": { "type": "InputNumber", "max": 65535, "min": 1000, "step": 1, "precision": 0 } }, "default_res_msg": { "name": "default_res_msg", "alias": "默认异常响应信息", "require": true, "default": "ERROR", "value": "ERROR", "type": "string", "description": "默认异常响应信息", "widget": { "type": "Input" } }, "response_template": { "name": "response_template", "alias": "异常中断响应表", "require": false, "default": "{}", "type": "string", "widget": { "type": "codeEditor" }, "value": "{}" } }, "input": {}, "output": { "message": { "type": "string", "alias": "message" } }, "group": [] }, "author": "liwen", "repository": "https://github.com/UBV/TcpServer", "bugs": "https://github.com/UBV/TcpServer/issues", "id": "a1d8d2a3-3c96-4862-904e-a874bef76a57", "_id": "1DBwzaY2tR0lAQ2J", "createdAt": "2022-06-21T10:16:06.395Z", "updatedAt": "2022-07-14T18:56:31.402Z", "ifShow": true, "customId": "node_72eca6e4", "ports": { "groups": { "top": { "position": "top", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } }, "bottom": { "position": "bottom", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } } }, "items": [{ "customId": "port_82c0c610", "group": "bottom", "label": { "direction": "output", "name": "message", "type": "string", "alias": "message" }, "color": "#165b5c", "id": "9591d6e0-64ca-4d8c-b42b-29f439ac3e0f" }] }, "position": { "x": -240, "y": 1160 }, "size": { "width": 300, "height": 130 }, "dropDownCheckBox": [], "parent": "group_e0278e38" }, { "alias": "Glue_Trigger_Parser", "name": "Glue_Trigger_Parser", "description": "TOOL__C__Glue_Trigger_Parser", "version": "1.0.0", "buildIn": false, "useGpu": false, "category": "TOOL", "config": { "module": "TOOL__C__Glue_Trigger_Parser", "executor": "parse", "initParams": {}, "input": { "origin_str": { "type": "string", "require": true, "alias": "origin_str" } }, "output": { "camera": { "type": "string", "alias": "camera" }, "heart": { "type": "string", "alias": "heart" } }, "group": [] }, "author": "sf-Sany", "updatedAt": "2022-07-19T11:58:18.297Z", "id": "b5fef33b-ede1-4d8a-888c-2bbfce294b98", "_id": "ywHaV9aVLeaakgcn", "createdAt": "2022-07-19T11:57:49.555Z", "ifShow": true, "customId": "node_1f183bca", "ports": { "groups": { "top": { "position": "top", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } }, "bottom": { "position": "bottom", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } } }, "items": [{ "customId": "port_ec6ea7e6", "group": "top", "label": { "direction": "input", "name": "origin_str", "type": "string", "require": true, "alias": "origin_str" }, "color": "#165b5c", "id": "88ffbb5b-d26a-42d3-9f91-337e0436d92a" }, { "customId": "port_90b1f6d0", "group": "bottom", "label": { "direction": "output", "name": "camera", "type": "string", "alias": "camera" }, "color": "#165b5c", "id": "fbcc3c56-0d77-4a49-adf0-2dbf14f03400" }, { "customId": "port_4a8425fd", "group": "bottom", "label": { "direction": "output", "name": "heart", "type": "string", "alias": "heart" }, "color": "#165b5c", "id": "058e4bdb-167e-48f4-9188-3273baff14e4" }] }, "position": { "x": -250, "y": 1600 }, "size": { "width": 300, "height": 130 }, "dropDownCheckBox": [], "parent": "group_e0278e38" }, { "alias": "TCP-Responser", "name": "Responser", "description": "This is COMM Responser", "version": "0.0.1", "buildIn": false, "useGpu": false, "category": "COMM", "config": { "module": "COMM__A__Responser", "executor": "Responser", "initParams": { "respond_to": { "name": "respond_to", "alias": "respond_to", "require": false, "type": "string", "widget": { "type": "Input" }, "value": "a1d8d2a3-3c96-4862-904e-a874bef76a57" } }, "input": { "response": { "type": "string", "require": true, "alias": "response" } }, "output": {} }, "author": "lw-Sany", "repository": "https://github.com/UBV/ResultParser", "bugs": "https://github.com/UBV/ResultParser/issues", "codeEditor": false, "id": "b78ac9ce-d8f4-4e76-84eb-f38cf12a992a", "_id": "IIPdi27QjBzC76Ag", "createdAt": "2022-06-05T15:14:02.102Z", "updatedAt": "2022-07-14T18:56:31.401Z", "ifShow": true, "customId": "node_8a9c1478", "ports": { "groups": { "top": { "position": "top", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } }, "bottom": { "position": "bottom", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } } }, "items": [{ "customId": "port_59b0c7f5", "group": "top", "label": { "direction": "input", "name": "response", "type": "string", "require": true, "alias": "response" }, "color": "#165b5c", "id": "b97034ff-227c-4f7f-bb0d-8ad3248ba819" }] }, "position": { "x": -240, "y": 2050 }, "size": { "width": 300, "height": 130 }, "dropDownCheckBox": [], "parent": "group_e0278e38" }, { "alias": "DataServer", "name": "DataServer", "description": "This is a DataServer plugin", "version": "0.0.1", "buildIn": false, "useGpu": false, "category": "TOOL", "config": { "module": "TOOL__C__DataServer", "executor": "DataServer", "initParams": {}, "input": { "status": { "type": "int", "require": true, "alias": "status" }, "show_img_path": { "type": "string", "require": false, "alias": "show_img_path" } }, "output": {}, "group": [] }, "author": "liwen", "updatedAt": "2022-07-21T04:56:06.372Z", "_id": "bf1BpfxQGLUzkw2c", "createdAt": "2022-07-14T01:21:14.656Z", "id": "dc4e22e5-a1fe-4d99-9f2b-01367e813b1b", "ifShow": true, "customId": "node_45487823", "ports": { "groups": { "top": { "position": "top", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } }, "bottom": { "position": "bottom", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } } }, "items": [{ "customId": "port_efc2214c", "group": "top", "label": { "direction": "input", "name": "status", "type": "int", "require": true, "alias": "status" }, "color": "#7a3f59", "id": "91a87f00-4441-4857-8dae-dfc363367917" }, { "customId": "port_25177c19", "group": "top", "label": { "direction": "input", "name": "show_img_path", "type": "string", "require": false, "alias": "show_img_path" }, "color": "#165b5c", "id": "2712f986-c147-49dc-8f9a-ffd4a6f07f90" }] }, "position": { "x": 850.0000000000011, "y": 2590.0000000000027 }, "size": { "width": 300, "height": 130 }, "dropDownCheckBox": [], "parent": "group_490b7b77" }, { "alias": "Glue_Responser_Parser", "name": "Glue_Responser_Parser", "description": "TOOL__C__Glue_Responser_Parser", "version": "1.0.0", "buildIn": false, "useGpu": false, "category": "TOOL", "config": { "module": "TOOL__C__Glue_Responser_Parser", "executor": "parse", "initParams": {}, "input": { "status": { "type": "int", "require": true, "alias": "status" } }, "output": { "message": { "type": "string", "alias": "message" } }, "group": [] }, "author": "sf-Sany", "updatedAt": "2022-07-21T05:03:56.951Z", "id": "8989a55c-1f87-404a-8135-58dab5225829", "_id": "FfSVdxh6bFjrCZKe", "createdAt": "2022-07-21T05:03:51.617Z", "ifShow": true, "customId": "node_86392e2f", "ports": { "groups": { "top": { "position": "top", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } }, "bottom": { "position": "bottom", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } } }, "items": [{ "customId": "port_a1e0e149", "group": "top", "label": { "direction": "input", "name": "status", "type": "int", "require": true, "alias": "status" }, "color": "#7a3f59", "id": "6015e6e3-466d-4099-ae40-413e5e2b4ee4" }, { "customId": "port_d5ae06df", "group": "bottom", "label": { "direction": "output", "name": "message", "type": "string", "alias": "message" }, "color": "#165b5c", "id": "a3a0a2a0-48e1-41c1-93fa-21e92497380f" }] }, "position": { "x": 550.0000000000011, "y": 1990.0000000000027 }, "size": { "width": 300, "height": 130 }, "dropDownCheckBox": [], "parent": "group_490b7b77" }, { "alias": "Business_Glue_Station", "name": "Business_Glue_Station", "description": "This is a business  plugin for Glue station", "version": "0.0.1", "buildIn": false, "useGpu": false, "category": "CV", "config": { "module": "CV__C__Business_Glue_Station", "executor": "Business_Glue_Station", "initParams": { "glue_width_max": { "name": "glue_width_max", "alias": "glue_width_max", "require": false, "value": 80, "type": "int", "widget": { "type": "InputNumber", "max": 300, "min": 0, "step": 1, "precision": 0 } }, "glue_width_min": { "name": "glue_width_min", "alias": "glue_width_min", "require": false, "value": 1, "type": "int", "widget": { "type": "InputNumber", "max": 300, "min": 0, "step": 1, "precision": 0 } } }, "input": { "srcImg": { "type": "numpy.ndarray", "require": true, "alias": "srcImg" }, "maskImg": { "type": "numpy.ndarray", "require": true, "alias": "maskImg" } }, "output": { "status": { "type": "int", "alias": "status" }, "showImg": { "type": "numpy.ndarray", "alias": "showImg" } }, "group": [] }, "author": "Sany-ShenFei", "updatedAt": "2022-07-21T05:10:19.588Z", "id": "00798d3e-b188-4dec-a9bb-094552db721b", "_id": "rwz6WHooi52rSoQo", "createdAt": "2022-07-21T05:00:31.271Z", "ifShow": true, "customId": "node_90cc8e9d", "ports": { "groups": { "top": { "position": "top", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } }, "bottom": { "position": "bottom", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } } }, "items": [{ "customId": "port_491f4c24", "group": "top", "label": { "direction": "input", "name": "srcImg", "type": "numpy.ndarray", "require": true, "alias": "srcImg" }, "color": "#1acccf", "id": "1a2addf1-bd70-47bd-99dd-c436db43a226" }, { "customId": "port_c8b102bf", "group": "top", "label": { "direction": "input", "name": "maskImg", "type": "numpy.ndarray", "require": true, "alias": "maskImg" }, "color": "#1acccf", "id": "0551c2e5-658e-4cb4-ba93-19afc1f138d1" }, { "customId": "port_e1b3adac", "group": "bottom", "label": { "direction": "output", "name": "status", "type": "int", "alias": "status" }, "color": "#7a3f59", "id": "a7f6b04f-baa7-4a5e-901c-d41889514c80" }, { "customId": "port_d4718e1c", "group": "bottom", "label": { "direction": "output", "name": "showImg", "type": "numpy.ndarray", "alias": "showImg" }, "color": "#1acccf", "id": "ce651fd7-c5f2-4e6b-a719-6f877a53ca65" }] }, "position": { "x": 880.0000000000011, "y": 1690.0000000000027 }, "size": { "width": 300, "height": 130 }, "dropDownCheckBox": [], "parent": "group_490b7b77" }, { "alias": "服务TCPServer", "name": "TcpServer", "description": "TCP服务插件，跟监听指定端口的请求，并根据\"默认异常响应信息\"和 \"异常中断响应表\" 进行响应", "version": "0.0.2", "buildIn": false, "useGpu": false, "category": "SERV", "config": { "module": "SERV__A__TcpServer", "executor": "TcpServer", "initParams": { "port": { "name": "port", "alias": "port", "require": true, "default": 2000, "value": 5547, "type": "int", "description": "监听端口", "widget": { "type": "InputNumber", "max": 65535, "min": 1000, "step": 1, "precision": 0 } }, "default_res_msg": { "name": "default_res_msg", "alias": "默认异常响应信息", "require": true, "default": "ERROR", "value": "ERROR", "type": "string", "description": "默认异常响应信息", "widget": { "type": "Input" } }, "response_template": { "name": "response_template", "alias": "异常中断响应表", "require": false, "default": "{}", "type": "string", "widget": { "type": "codeEditor" }, "value": "{}" } }, "input": {}, "output": { "message": { "type": "string", "alias": "message" } }, "group": [] }, "author": "liwen", "repository": "https://github.com/UBV/TcpServer", "bugs": "https://github.com/UBV/TcpServer/issues", "id": "bbdd935f-f587-4db9-ad66-f32caec4d18b", "_id": "1DBwzaY2tR0lAQ2J", "createdAt": "2022-06-21T10:16:06.395Z", "updatedAt": "2022-07-14T18:56:31.402Z", "ifShow": true, "customId": "node_45ed4f5c", "ports": { "groups": { "top": { "position": "top", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } }, "bottom": { "position": "bottom", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } } }, "items": [{ "customId": "port_688d2b5c", "group": "bottom", "label": { "direction": "output", "name": "message", "type": "string", "alias": "message" }, "color": "#165b5c", "id": "a0ae4b81-5784-4661-b4d5-400266424ccd" }] }, "position": { "x": 600, "y": 640 }, "dropDownCheckBox": [], "size": { "width": 300, "height": 130 } }], "edges": [{ "shape": "dag-edge", "attrs": { "line": { "stroke": "#165b5c", "strokeWidth": 6, "strokeDasharray": "" } }, "zIndex": 0, "id": "31632592-8086-42b8-938a-de01e4ed5ba8", "parent": "group_e0278e38", "data": { "status": "STOPPED", "graphLock": false, "guid": "4f97ab41" }, "source": { "cell": "b5fef33b-ede1-4d8a-888c-2bbfce294b98", "port": "058e4bdb-167e-48f4-9188-3273baff14e4" }, "target": { "cell": "b78ac9ce-d8f4-4e76-84eb-f38cf12a992a", "port": "b97034ff-227c-4f7f-bb0d-8ad3248ba819" } }, { "shape": "dag-edge", "attrs": { "line": { "stroke": "#165b5c", "strokeWidth": 6, "strokeDasharray": "" } }, "zIndex": 0, "id": "daec7b08-45f6-4891-974b-bc9a198a8238", "parent": "group_e0278e38", "data": { "status": "STOPPED", "graphLock": false, "guid": "bdd8acb0" }, "source": { "cell": "a1d8d2a3-3c96-4862-904e-a874bef76a57", "port": "9591d6e0-64ca-4d8c-b42b-29f439ac3e0f" }, "target": { "cell": "b5fef33b-ede1-4d8a-888c-2bbfce294b98", "port": "88ffbb5b-d26a-42d3-9f91-337e0436d92a" } }, { "shape": "dag-edge", "attrs": { "line": { "stroke": "#1acccf", "strokeWidth": 6, "strokeDasharray": "" } }, "zIndex": 0, "id": "3b4fd793-123a-440d-ac6a-507e687acfb0", "parent": "group_490b7b77", "data": { "status": "STOPPED", "graphLock": false, "guid": "c746c605" }, "source": { "cell": "c98381bf-8e21-443b-b241-ee8a07d11b7b", "port": "7961fb07-7eec-443e-91c5-6a3177732566" }, "target": { "cell": "00798d3e-b188-4dec-a9bb-094552db721b", "port": "1a2addf1-bd70-47bd-99dd-c436db43a226" } }, { "shape": "dag-edge", "attrs": { "line": { "stroke": "#1acccf", "strokeWidth": 6, "strokeDasharray": "" } }, "zIndex": 0, "id": "7fc677de-9e0c-4d08-a895-ce783dfe2928", "data": { "status": "STOPPED", "graphLock": false, "guid": "68bd30c1" }, "parent": "group_490b7b77", "source": { "cell": "c98381bf-8e21-443b-b241-ee8a07d11b7b", "port": "7961fb07-7eec-443e-91c5-6a3177732566" }, "target": { "cell": "56284350-1bc5-465f-b7d4-2c7fbe94097d", "port": "7c77e391-3961-4bbb-b009-a347149b449e" } }, { "shape": "dag-edge", "attrs": { "line": { "stroke": "#165b5c", "strokeWidth": 6, "strokeDasharray": "" } }, "zIndex": 0, "id": "b935179d-0abb-4141-9eee-313fe6d07003", "data": { "status": "STOPPED", "graphLock": false, "guid": "c285aaf4" }, "parent": "group_490b7b77", "source": { "cell": "c98381bf-8e21-443b-b241-ee8a07d11b7b", "port": "51510414-8a0c-49f6-a6b0-3eec528bed65" }, "target": { "cell": "56284350-1bc5-465f-b7d4-2c7fbe94097d", "port": "c74b7ffb-9cab-4583-92ec-9700ce552318" } }, { "shape": "dag-edge", "attrs": { "line": { "stroke": "#1acccf", "strokeWidth": 6, "strokeDasharray": "" } }, "zIndex": 0, "id": "da5b3fdd-f8da-4b6a-9e21-bbbbe388d722", "data": { "status": "STOPPED", "graphLock": false, "guid": "c002a448" }, "parent": "group_490b7b77", "source": { "cell": "c98381bf-8e21-443b-b241-ee8a07d11b7b", "port": "7961fb07-7eec-443e-91c5-6a3177732566" }, "target": { "cell": "1f90147b-c49c-4884-803f-1c97f9824655", "port": "32f85b78-82b7-4bd8-b2c9-43a3a5a7903f" } }, { "shape": "dag-edge", "attrs": { "line": { "stroke": "#165b5c", "strokeWidth": 6, "strokeDasharray": "" } }, "zIndex": 0, "id": "1bd00053-dd11-43d7-bb29-be47cbb15b3f", "source": { "cell": "3e41e3d3-2ef4-44fc-9771-d352e634dfdf", "port": "c2aeed53-807a-49ea-b265-6f0f206064d6" }, "target": { "cell": "c98381bf-8e21-443b-b241-ee8a07d11b7b", "port": "8c3b5c46-5934-496d-ac5f-d8b1ca403188" } }, { "shape": "dag-edge", "attrs": { "line": { "stroke": "#7a3f59", "strokeWidth": 6, "strokeDasharray": "" } }, "zIndex": 0, "id": "957cb389-aa29-42f7-b182-ea918580d9b0", "data": { "status": "STOPPED", "graphLock": false, "guid": "f303258c" }, "parent": "group_490b7b77", "source": { "cell": "00798d3e-b188-4dec-a9bb-094552db721b", "port": "a7f6b04f-baa7-4a5e-901c-d41889514c80" }, "target": { "cell": "8989a55c-1f87-404a-8135-58dab5225829", "port": "6015e6e3-466d-4099-ae40-413e5e2b4ee4" } }, { "shape": "dag-edge", "attrs": { "line": { "stroke": "#1acccf", "strokeWidth": 6, "strokeDasharray": "" } }, "zIndex": 0, "id": "a367cd6d-29d2-4df9-9e78-b1b05a6286a8", "data": { "status": "STOPPED", "graphLock": false, "guid": "669c38bd" }, "parent": "group_490b7b77", "source": { "cell": "00798d3e-b188-4dec-a9bb-094552db721b", "port": "ce651fd7-c5f2-4e6b-a719-6f877a53ca65" }, "target": { "cell": "45e063e4-8d3e-4e10-a1cd-48be2f78e97a", "port": "71cb731c-4648-41d6-933a-946f2a0db521" } }, { "shape": "dag-edge", "attrs": { "line": { "stroke": "#7a3f59", "strokeWidth": 6, "strokeDasharray": "" } }, "zIndex": 0, "id": "79727e41-f91a-42af-8610-bf695d1d5bab", "data": { "status": "STOPPED", "graphLock": false, "guid": "c88e20bc" }, "parent": "group_490b7b77", "source": { "cell": "00798d3e-b188-4dec-a9bb-094552db721b", "port": "a7f6b04f-baa7-4a5e-901c-d41889514c80" }, "target": { "cell": "dc4e22e5-a1fe-4d99-9f2b-01367e813b1b", "port": "91a87f00-4441-4857-8dae-dfc363367917" } }, { "shape": "dag-edge", "attrs": { "line": { "stroke": "#1acccf", "strokeWidth": 6, "strokeDasharray": "" } }, "zIndex": 0, "id": "198f0bee-a079-4393-a218-eff672ec0e45", "data": { "status": "STOPPED", "graphLock": false, "guid": "14f3b8d0" }, "parent": "group_490b7b77", "source": { "cell": "1f90147b-c49c-4884-803f-1c97f9824655", "port": "3419b89d-70be-479c-9877-75ce3bcfdf98" }, "target": { "cell": "00798d3e-b188-4dec-a9bb-094552db721b", "port": "0551c2e5-658e-4cb4-ba93-19afc1f138d1" } }, { "shape": "dag-edge", "attrs": { "line": { "stroke": "#165b5c", "strokeWidth": 6, "strokeDasharray": "" } }, "zIndex": 0, "id": "b46c8c19-0e51-48a0-8aca-c194b6478543", "data": { "status": "STOPPED", "graphLock": false, "guid": "fb78dabc" }, "parent": "group_490b7b77", "source": { "cell": "8989a55c-1f87-404a-8135-58dab5225829", "port": "a3a0a2a0-48e1-41c1-93fa-21e92497380f" }, "target": { "cell": "b4f890bc-3254-4e03-a4bb-7e16b8d5534d", "port": "b6e929c7-606a-477d-9de1-9c5751936aca" } }, { "shape": "dag-edge", "attrs": { "line": { "stroke": "#165b5c", "strokeWidth": 6, "strokeDasharray": "" } }, "zIndex": 0, "id": "83b3763e-8da2-4e7e-ae9e-d57b4bc9c113", "data": { "status": "STOPPED", "graphLock": false, "guid": "e4af8da9" }, "parent": "group_490b7b77", "source": { "cell": "45e063e4-8d3e-4e10-a1cd-48be2f78e97a", "port": "5c66b076-ef20-4c1e-8c41-683c8ba170b2" }, "target": { "cell": "dc4e22e5-a1fe-4d99-9f2b-01367e813b1b", "port": "2712f986-c147-49dc-8f9a-ffd4a6f07f90" } }, { "shape": "dag-edge", "attrs": { "line": { "stroke": "#165b5c", "strokeWidth": 6, "strokeDasharray": "" } }, "zIndex": 0, "id": "4c9746a9-80ec-49af-aeeb-68f273ee6346", "source": { "cell": "bbdd935f-f587-4db9-ad66-f32caec4d18b", "port": "a0ae4b81-5784-4661-b4d5-400266424ccd" }, "target": { "cell": "3e41e3d3-2ef4-44fc-9771-d352e634dfdf", "port": "627134a1-328f-4aa2-8125-efef9f5b23ec" } }] }, "configList": [{ "label": "配置1", "value": "826wcjd2", "data": [{ "name": "ImageStorge", "version": "0.0.2", "category": "DS", "description": "This is a DataStorage plugin", "author": "liwen", "config": { "module": "DS__A__ImageStorge", "executor": "ImageStorge", "initParams": { "store_dir": { "name": "store_dir", "alias": "存图目录", "require": true, "onHidden": true, "default": "/tmp/ubvision", "value": "/data/pangu-fs/track-inspect", "type": "Dir", "description": "选择一个存图目录", "widget": { "type": "Dir" } }, "target_format": { "name": "target_format", "alias": "存图格式", "require": true, "default": "jpg", "value": ".png", "type": "List[string]", "widget": { "type": "Radio", "options": [".jpg", ".png", ".bmp"] } }, "platForm_723b3e19": { "name": "platForm_723b3e19", "alias": "platForm_723b3e19", "orderId": 5, "require": false, "default": "/Users/wilr/Downloads/201656991026_.pic_hd.jpg", "localPath": "https://seopic.699pic.com/photo/40015/5662.jpg_wh1200.jpg", "value": [{ "id": "1673425116332", "type": "RECT", "props": { "name": "矩形矢量图形", "textId": "label-text-id-1673425116332", "deleteMarkerId": "label-marker-id-1673425116332", "label": "缺陷" }, "style": { "opacity": 1, "fillStyle": "rgba(255, 0, 0, 0)", "lineWidth": 1, "strokeStyle": "#F00" }, "shape": { "x": 331.7559993018706, "y": 157.17094700662133, "width": 87.26617870328407, "height": 45.616411594898494 } }, { "id": "1673425118679", "type": "CIRCLE", "props": { "name": "圆形矢量图层", "textId": "label-text-id-1673425118679", "deleteMarkerId": "label-marker-id-1673425118679", "label": "缺陷" }, "style": { "opacity": 1, "fillStyle": "#9370DB", "lineWidth": 2, "strokeStyle": "#F00" }, "option": { "active": false }, "shape": { "cx": 531.0798847491444, "cy": 130.39609672265917, "r": 41.5197036429828 } }], "type": "File", "description": "标注", "widget": { "type": "ImageLabelField", "id": "platForm_723b3e19" } } }, "input": { "src_img": { "type": "numpy.ndarray", "require": true, "alias": "src_img" }, "category": { "type": "string", "require": false, "alias": "category" }, "img_name": { "type": "string", "require": false, "alias": "img_name" } }, "output": { "status": { "type": "bool", "alias": "status123123123qwe" }, "category": { "type": "string", "alias": "category" }, "store_path": { "type": "string", "alias": "store_path" } } }, "alias": "图片存储器ImgStorge", "buildIn": false, "useGpu": false, "id": "45e063e4-8d3e-4e10-a1cd-48be2f78e97a", "_id": "SNF8MEF6cMipAYTE", "createdAt": "2022-06-21T10:15:17.282Z", "updatedAt": "2022-06-21T10:17:15.705Z", "ifShow": true, "customId": "node_d732fd33", "ports": { "groups": { "top": { "position": "top", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } }, "bottom": { "position": "bottom", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } } }, "items": [{ "customId": "port_1f452085", "group": "top", "label": { "direction": "input", "name": "src_img", "type": "numpy.ndarray", "require": true, "alias": "src_img" }, "color": "#1acccf", "id": "71cb731c-4648-41d6-933a-946f2a0db521" }, { "customId": "port_ac4beda0", "group": "top", "label": { "direction": "input", "name": "category", "type": "string", "require": false, "alias": "category" }, "color": "#165b5c", "id": "e5d20ecc-b2dc-4d2f-a7b4-bf0ecc1bcaa6" }, { "customId": "port_b1ee47eb", "group": "top", "label": { "direction": "input", "name": "img_name", "type": "string", "require": false, "alias": "img_name" }, "color": "#165b5c", "id": "e7e1dabe-8ba7-4c39-a787-f0fbbcd4cfba" }, { "customId": "port_b86c9517", "group": "bottom", "label": { "direction": "output", "name": "status", "type": "bool", "alias": "status" }, "color": "#7d573a", "id": "f409838a-abbb-4f7e-8e14-98432257447a" }, { "customId": "port_1a110c28", "group": "bottom", "label": { "direction": "output", "name": "category", "type": "string", "alias": "category" }, "color": "#165b5c", "id": "d87d04e9-331f-4334-922d-6c826211a848" }, { "customId": "port_508b1d0d", "group": "bottom", "label": { "direction": "output", "name": "store_path", "type": "string", "alias": "store_path" }, "color": "#165b5c", "id": "5c66b076-ef20-4c1e-8c41-683c8ba170b2" }] }, "position": { "x": 1060.0000000000011, "y": 2000.0000000000027 }, "dropDownCheckBox": ["result"], "size": { "width": 480, "height": 370 }, "parent": "group_490b7b77" }, { "name": "ImageStorge.json", "version": "0.0.2", "category": "DS", "description": "This is a DataStorage plugin", "author": "liwen", "config": { "module": "DS__A__ImageStorge", "executor": "ImageStorge", "initParams": { "store_dir": { "name": "store_dir", "alias": "存图目录", "require": true, "onHidden": true, "default": "/tmp/ubvision", "value": "/data/simulate/images", "type": "Dir", "description": "选择一个存图目录", "widget": { "type": "Dir" } }, "target_format": { "name": "target_format", "alias": "存图格式", "require": true, "default": "jpg", "value": ".jpg", "type": "List[string]", "widget": { "type": "Radio", "options": [".jpg", ".png", ".bmp"] } } }, "input": { "src_img": { "type": "numpy.ndarray", "require": true, "alias": "src_img" }, "category": { "type": "string", "require": false, "alias": "category" }, "img_name": { "type": "string", "require": false, "alias": "img_name" } }, "output": { "status": { "type": "bool", "alias": "status" }, "category": { "type": "string", "alias": "category" }, "store_path": { "type": "string", "alias": "store_path" } }, "group": [] }, "alias": "图片存储器ImgStorge.json", "buildIn": false, "useGpu": false, "id": "56284350-1bc5-465f-b7d4-2c7fbe94097d", "_id": "SNF8MEF6cMipAYTE", "createdAt": "2022-06-21T10:15:17.282Z", "updatedAt": "2022-07-13T11:02:57.716Z", "ifShow": true, "customId": "node_5f987d1b", "ports": { "groups": { "top": { "position": "top", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } }, "bottom": { "position": "bottom", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } } }, "items": [{ "customId": "port_b3a9431b", "group": "top", "label": { "direction": "input", "name": "src_img", "type": "numpy.ndarray", "require": true, "alias": "src_img" }, "color": "#1acccf", "id": "7c77e391-3961-4bbb-b009-a347149b449e" }, { "customId": "port_264baf3a", "group": "top", "label": { "direction": "input", "name": "category", "type": "string", "require": false, "alias": "category" }, "color": "#165b5c", "id": "c74b7ffb-9cab-4583-92ec-9700ce552318" }, { "customId": "port_0ddb2da7", "group": "top", "label": { "direction": "input", "name": "img_name", "type": "string", "require": false, "alias": "img_name" }, "color": "#165b5c", "id": "9c65211b-8867-4cb5-8f39-8a21cee512ce" }, { "customId": "port_4f452295", "group": "bottom", "label": { "direction": "output", "name": "status", "type": "bool", "alias": "status" }, "color": "#7d573a", "id": "5bdac4c1-3403-47c9-b7a4-7e5fb789559b" }, { "customId": "port_a20d197c", "group": "bottom", "label": { "direction": "output", "name": "category", "type": "string", "alias": "category" }, "color": "#165b5c", "id": "28eae3a6-f1d8-4e16-88c9-6e385cac052f" }, { "customId": "port_854a6544", "group": "bottom", "label": { "direction": "output", "name": "store_path", "type": "string", "alias": "store_path" }, "color": "#165b5c", "id": "14306f65-e705-4ca7-8769-cc093726a35c" }] }, "position": { "x": 830.0000000000011, "y": 1370.0000000000027 }, "size": { "width": 444, "height": 130 }, "dropDownCheckBox": ["result"], "parent": "group_490b7b77" }, { "name": "Responser.json", "version": "0.0.1", "category": "COMM", "description": "This is COMM Responser", "author": "lw-Sany", "repository": "https://github.com/UBV/ResultParser", "bugs": "https://github.com/UBV/ResultParser/issues", "config": { "module": "COMM__A__Responser", "executor": "Responser", "initParams": { "respond_to": { "name": "respond_to", "alias": "respond_to", "require": false, "type": "string", "widget": { "type": "Input" }, "value": "1fbf97c8-d887-43a5-8f2c-ed198e098b8b" } }, "input": { "response": { "type": "string", "require": true, "alias": "response" } }, "output": {} }, "alias": "TCP-Responser.json", "buildIn": false, "useGpu": false, "codeEditor": false, "id": "b4f890bc-3254-4e03-a4bb-7e16b8d5534d", "_id": "IIPdi27QjBzC76Ag", "createdAt": "2022-06-05T15:14:02.102Z", "updatedAt": "2022-07-13T11:03:30.387Z", "ifShow": true, "customId": "node_bf76a6ee", "ports": { "groups": { "top": { "position": "top", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } }, "bottom": { "position": "bottom", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } } }, "items": [{ "customId": "port_7987924e", "group": "top", "label": { "direction": "input", "name": "response", "type": "string", "require": true, "alias": "response" }, "color": "#165b5c", "id": "b6e929c7-606a-477d-9de1-9c5751936aca" }] }, "position": { "x": 540.0000000000011, "y": 2280.0000000000027 }, "size": { "width": 300, "height": 130 }, "dropDownCheckBox": [], "parent": "group_490b7b77" }, { "name": "Glue_Trigger_Parser", "version": "1.0.0", "category": "TOOL", "description": "TOOL__C__Glue_Trigger_Parser", "author": "sf-Sany", "config": { "module": "TOOL__C__Glue_Trigger_Parser", "executor": "parse", "initParams": {}, "input": { "origin_str": { "type": "string", "require": true, "alias": "origin_str" } }, "output": { "camera": { "type": "string", "alias": "camera" }, "heart": { "type": "string", "alias": "heart" } }, "group": [] }, "updatedAt": "2022-07-13T13:14:32.108Z", "id": "3e41e3d3-2ef4-44fc-9771-d352e634dfdf", "_id": "cONUuPsSLoL8Rx5F", "createdAt": "2022-07-13T13:14:24.753Z", "alias": "Glue_Trigger_Parser", "buildIn": false, "useGpu": false, "ifShow": true, "customId": "node_d2946b47", "ports": { "groups": { "top": { "position": "top", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } }, "bottom": { "position": "bottom", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } } }, "items": [{ "customId": "port_57fac917", "group": "top", "label": { "direction": "input", "name": "origin_str", "type": "string", "require": true, "alias": "origin_str" }, "color": "#165b5c", "id": "627134a1-328f-4aa2-8125-efef9f5b23ec" }, { "customId": "port_b8f22edb", "group": "bottom", "label": { "direction": "output", "name": "camera", "type": "string", "alias": "camera" }, "color": "#165b5c", "id": "c2aeed53-807a-49ea-b265-6f0f206064d6" }, { "customId": "port_0c5a998c", "group": "bottom", "label": { "direction": "output", "name": "heart", "type": "string", "alias": "heart" }, "color": "#165b5c", "id": "8852db72-a768-43d3-b57d-be7443a0202b" }] }, "position": { "x": 1380, "y": 650.0000000000003 }, "size": { "width": 300, "height": 130 }, "dropDownCheckBox": [], "parent": "group_6a56067b" }, { "alias": "AIEngine", "name": "AIEngine", "description": "This is an ai engine plugin for industrial visual quality inspection\n2022.7.1", "version": "0.1.0", "buildIn": false, "useGpu": true, "category": "CV", "config": { "module": "CV__B__AIEngine", "executor": "AIEngine", "initParams": { "config_path": { "name": "config_path", "alias": "config_path", "require": false, "type": "File", "widget": { "type": "File", "suffix": [".jpg/.jpeg", ".png", ".svg", ".pdf", ".pt", ".py", ".doc/.docx", ".csv", ".bmp", ".json", "all"] }, "value": "/opt/ubvision/tujiao/resources/configs/seg_swin_transformer_st_tujiao.json" }, "model_path": { "name": "model_path", "alias": "model_path", "require": false, "type": "File", "widget": { "type": "File", "suffix": [".jpg/.jpeg", ".png", ".svg", ".pdf", ".pt", ".py", ".doc/.docx", ".csv", ".bmp", ".json", "all"] }, "value": "/opt/ubvision/tujiao/resources/models/iter_44000_w1024xh1024_sim_fp32.engine" } }, "input": { "srcImg": { "type": "numpy.ndarray", "require": true, "alias": "srcImg" } }, "output": { "class_name": { "type": "list", "alias": "class_name" }, "masks": { "type": "numpy.ndarray", "alias": "masks" }, "shapes": { "type": "dict", "alias": "shapes" }, "status": { "type": "bool", "alias": "status" } }, "group": [] }, "author": "zwt-Sany", "repository": "https://github.com/QIVG/AlgorithmPluginDemo", "bugs": "https://github.com/QIVG/AlgorithmPluginDemo/issues", "_id": "Ug3bhG8x9kYJHpGM", "createdAt": "2022-06-17T13:08:34.434Z", "updatedAt": "2022-07-14T18:56:31.404Z", "id": "1f90147b-c49c-4884-803f-1c97f9824655", "ifShow": true, "customId": "node_84079990", "ports": { "groups": { "top": { "position": "top", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } }, "bottom": { "position": "bottom", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } } }, "items": [{ "customId": "port_c79f6953", "group": "top", "label": { "direction": "input", "name": "srcImg", "type": "numpy.ndarray", "require": true, "alias": "srcImg" }, "color": "#1acccf", "id": "32f85b78-82b7-4bd8-b2c9-43a3a5a7903f" }, { "customId": "port_e9d93c82", "group": "bottom", "label": { "direction": "output", "name": "class_name", "type": "list", "alias": "class_name" }, "color": "#694256", "id": "ffde9a57-9e5b-43a2-aeef-47e4f0fb0c8e" }, { "customId": "port_5d4da216", "group": "bottom", "label": { "direction": "output", "name": "masks", "type": "numpy.ndarray", "alias": "masks" }, "color": "#1acccf", "id": "3419b89d-70be-479c-9877-75ce3bcfdf98" }, { "customId": "port_7d268669", "group": "bottom", "label": { "direction": "output", "name": "shapes", "type": "dict", "alias": "shapes" }, "color": "#425e7e", "id": "a9186b9f-850a-4a0b-8eb2-aa9ad5ee9c6d" }, { "customId": "port_369b74fd", "group": "bottom", "label": { "direction": "output", "name": "status", "type": "bool", "alias": "status" }, "color": "#7d573a", "id": "d6bdeada-adea-41de-8f90-426e5c945318" }] }, "position": { "x": 1380.0000000000011, "y": 1350.0000000000027 }, "size": { "width": 592, "height": 130 }, "dropDownCheckBox": [], "parent": "group_490b7b77" }, { "alias": "GalaxyCamera", "name": "GalaxyCamera", "description": "GalaxyCamera", "version": "0.1.0", "buildIn": false, "useGpu": false, "category": "CAPTURE", "config": { "module": "CAPTURE__B__GalaxyCamera", "executor": "Camera", "initParams": { "camera_name": { "name": "camera_name", "alias": "camera_name", "require": false, "default": "DefaultCam", "value": "DefaultCam", "type": "string", "widget": { "type": "Input" } }, "serial_number": { "name": "serial_number", "alias": "serial_number", "require": true, "default": " ", "value": "LT0210051918", "type": "string", "widget": { "type": "Input" } }, "exposure_time": { "name": "exposure_time", "alias": "exposure_time", "require": true, "default": 5000, "value": 1500, "type": "int", "widget": { "type": "InputNumber", "max": 100000, "min": 500, "step": 100, "precision": 0 } }, "data_format": { "name": "data_format", "alias": "data_format", "require": false, "default": "RGB", "value": "RGB", "type": "List[string]", "widget": { "type": "Radio", "options": ["RGB", "GRAY", "RAW"] } }, "interval_time": { "name": "interval_time", "alias": "interval_time", "require": true, "default": 0, "type": "float", "widget": { "type": "InputNumber", "max": 5, "min": 0, "step": 0.05, "precision": 2 }, "value": 0.1 }, "width": { "type": "float", "default": 2048, "require": false, "widget": { "type": "InputNumber", "max": 6000, "min": 100, "step": 1, "precision": 1 }, "value": 5496, "alias": "width", "name": "width" }, "height": { "type": "float", "default": 2048, "require": false, "widget": { "type": "InputNumber", "max": 6000, "min": 100, "step": 1, "precision": 1 }, "value": 3672, "alias": "height", "name": "height" }, "DEV_MAPPER": { "type": "str", "default": "/dev/bus/usb", "value": "/dev/bus/usb", "require": true, "widget": { "type": "Input" }, "alias": "DEV_MAPPER", "name": "DEV_MAPPER" }, "NETWORKMODE": { "default": "host", "require": true, "value": "host", "type": "List[string]", "widget": { "type": "Radio", "options": ["host", "bridge"] }, "alias": "NETWORKMODE", "name": "NETWORKMODE" }, "Gain": { "name": "Gain", "alias": "Gain", "require": true, "default": 10, "value": 10, "type": "float", "widget": { "type": "Slider", "max": 20, "min": 0.1, "step": 0.1 } } }, "input": { "signal": { "type": "string", "require": true, "alias": "signal" } }, "output": { "frame": { "type": "numpy.ndarray", "alias": "frame" }, "category": { "type": "string", "alias": "category" }, "status": { "type": "bool", "alias": "status" } }, "group": [{ "id": "76a2eea9", "open": false, "children": ["NETWORKMODE", "DEV_MAPPER"], "name": "Advanced Options" }] }, "author": "liwen", "_id": "UEpwqYTvke6un0Rs", "createdAt": "2022-07-10T03:06:07.682Z", "updatedAt": "2022-07-15T07:45:51.867Z", "id": "c98381bf-8e21-443b-b241-ee8a07d11b7b", "ifShow": true, "customId": "node_0bb7ada6", "ports": { "groups": { "top": { "position": "top", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } }, "bottom": { "position": "bottom", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } } }, "items": [{ "customId": "port_b776d46c", "group": "top", "label": { "direction": "input", "name": "signal", "type": "string", "require": true, "alias": "signal" }, "color": "#165b5c", "id": "8c3b5c46-5934-496d-ac5f-d8b1ca403188" }, { "customId": "port_42c40766", "group": "bottom", "label": { "direction": "output", "name": "frame", "type": "numpy.ndarray", "alias": "frame" }, "color": "#1acccf", "id": "7961fb07-7eec-443e-91c5-6a3177732566" }, { "customId": "port_a7b8fbcc", "group": "bottom", "label": { "direction": "output", "name": "category", "type": "string", "alias": "category" }, "color": "#165b5c", "id": "51510414-8a0c-49f6-a6b0-3eec528bed65" }, { "customId": "port_ddc16065", "group": "bottom", "label": { "direction": "output", "name": "status", "type": "bool", "alias": "status" }, "color": "#7d573a", "id": "7837188d-ec7e-440a-b1d1-396334560acf" }] }, "position": { "x": 810.0000000000011, "y": 1060.0000000000027 }, "size": { "width": 444, "height": 130 }, "dropDownCheckBox": [], "parent": "group_490b7b77" }, { "alias": "服务TCPServer", "name": "TcpServer", "description": "TCP服务插件，跟监听指定端口的请求，并根据\"默认异常响应信息\"和 \"异常中断响应表\" 进行响应", "version": "0.0.2", "buildIn": false, "useGpu": false, "category": "SERV", "config": { "module": "SERV__A__TcpServer", "executor": "TcpServer", "initParams": { "port": { "name": "port", "alias": "port", "require": true, "default": 2000, "value": 5546, "type": "int", "description": "监听端口", "widget": { "type": "InputNumber", "max": 65535, "min": 1000, "step": 1, "precision": 0 } }, "default_res_msg": { "name": "default_res_msg", "alias": "默认异常响应信息", "require": true, "default": "ERROR", "value": "ERROR", "type": "string", "description": "默认异常响应信息", "widget": { "type": "Input" } }, "response_template": { "name": "response_template", "alias": "异常中断响应表", "require": false, "default": "{}", "type": "string", "widget": { "type": "codeEditor" }, "value": "{}" } }, "input": {}, "output": { "message": { "type": "string", "alias": "message" } }, "group": [] }, "author": "liwen", "repository": "https://github.com/UBV/TcpServer", "bugs": "https://github.com/UBV/TcpServer/issues", "id": "a1d8d2a3-3c96-4862-904e-a874bef76a57", "_id": "1DBwzaY2tR0lAQ2J", "createdAt": "2022-06-21T10:16:06.395Z", "updatedAt": "2022-07-14T18:56:31.402Z", "ifShow": true, "customId": "node_72eca6e4", "ports": { "groups": { "top": { "position": "top", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } }, "bottom": { "position": "bottom", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } } }, "items": [{ "customId": "port_82c0c610", "group": "bottom", "label": { "direction": "output", "name": "message", "type": "string", "alias": "message" }, "color": "#165b5c", "id": "9591d6e0-64ca-4d8c-b42b-29f439ac3e0f" }] }, "position": { "x": -240, "y": 1160 }, "size": { "width": 300, "height": 130 }, "dropDownCheckBox": [], "parent": "group_e0278e38" }, { "alias": "Glue_Trigger_Parser", "name": "Glue_Trigger_Parser", "description": "TOOL__C__Glue_Trigger_Parser", "version": "1.0.0", "buildIn": false, "useGpu": false, "category": "TOOL", "config": { "module": "TOOL__C__Glue_Trigger_Parser", "executor": "parse", "initParams": {}, "input": { "origin_str": { "type": "string", "require": true, "alias": "origin_str" } }, "output": { "camera": { "type": "string", "alias": "camera" }, "heart": { "type": "string", "alias": "heart" } }, "group": [] }, "author": "sf-Sany", "updatedAt": "2022-07-19T11:58:18.297Z", "id": "b5fef33b-ede1-4d8a-888c-2bbfce294b98", "_id": "ywHaV9aVLeaakgcn", "createdAt": "2022-07-19T11:57:49.555Z", "ifShow": true, "customId": "node_1f183bca", "ports": { "groups": { "top": { "position": "top", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } }, "bottom": { "position": "bottom", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } } }, "items": [{ "customId": "port_ec6ea7e6", "group": "top", "label": { "direction": "input", "name": "origin_str", "type": "string", "require": true, "alias": "origin_str" }, "color": "#165b5c", "id": "88ffbb5b-d26a-42d3-9f91-337e0436d92a" }, { "customId": "port_90b1f6d0", "group": "bottom", "label": { "direction": "output", "name": "camera", "type": "string", "alias": "camera" }, "color": "#165b5c", "id": "fbcc3c56-0d77-4a49-adf0-2dbf14f03400" }, { "customId": "port_4a8425fd", "group": "bottom", "label": { "direction": "output", "name": "heart", "type": "string", "alias": "heart" }, "color": "#165b5c", "id": "058e4bdb-167e-48f4-9188-3273baff14e4" }] }, "position": { "x": -250, "y": 1600 }, "size": { "width": 300, "height": 130 }, "dropDownCheckBox": [], "parent": "group_e0278e38" }, { "alias": "TCP-Responser", "name": "Responser", "description": "This is COMM Responser", "version": "0.0.1", "buildIn": false, "useGpu": false, "category": "COMM", "config": { "module": "COMM__A__Responser", "executor": "Responser", "initParams": { "respond_to": { "name": "respond_to", "alias": "respond_to", "require": false, "type": "string", "widget": { "type": "Input" }, "value": "a1d8d2a3-3c96-4862-904e-a874bef76a57" } }, "input": { "response": { "type": "string", "require": true, "alias": "response" } }, "output": {} }, "author": "lw-Sany", "repository": "https://github.com/UBV/ResultParser", "bugs": "https://github.com/UBV/ResultParser/issues", "codeEditor": false, "id": "b78ac9ce-d8f4-4e76-84eb-f38cf12a992a", "_id": "IIPdi27QjBzC76Ag", "createdAt": "2022-06-05T15:14:02.102Z", "updatedAt": "2022-07-14T18:56:31.401Z", "ifShow": true, "customId": "node_8a9c1478", "ports": { "groups": { "top": { "position": "top", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } }, "bottom": { "position": "bottom", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } } }, "items": [{ "customId": "port_59b0c7f5", "group": "top", "label": { "direction": "input", "name": "response", "type": "string", "require": true, "alias": "response" }, "color": "#165b5c", "id": "b97034ff-227c-4f7f-bb0d-8ad3248ba819" }] }, "position": { "x": -240, "y": 2050 }, "size": { "width": 300, "height": 130 }, "dropDownCheckBox": [], "parent": "group_e0278e38" }, { "alias": "DataServer", "name": "DataServer", "description": "This is a DataServer plugin", "version": "0.0.1", "buildIn": false, "useGpu": false, "category": "TOOL", "config": { "module": "TOOL__C__DataServer", "executor": "DataServer", "initParams": {}, "input": { "status": { "type": "int", "require": true, "alias": "status" }, "show_img_path": { "type": "string", "require": false, "alias": "show_img_path" } }, "output": {}, "group": [] }, "author": "liwen", "updatedAt": "2022-07-21T04:56:06.372Z", "_id": "bf1BpfxQGLUzkw2c", "createdAt": "2022-07-14T01:21:14.656Z", "id": "dc4e22e5-a1fe-4d99-9f2b-01367e813b1b", "ifShow": true, "customId": "node_45487823", "ports": { "groups": { "top": { "position": "top", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } }, "bottom": { "position": "bottom", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } } }, "items": [{ "customId": "port_efc2214c", "group": "top", "label": { "direction": "input", "name": "status", "type": "int", "require": true, "alias": "status" }, "color": "#7a3f59", "id": "91a87f00-4441-4857-8dae-dfc363367917" }, { "customId": "port_25177c19", "group": "top", "label": { "direction": "input", "name": "show_img_path", "type": "string", "require": false, "alias": "show_img_path" }, "color": "#165b5c", "id": "2712f986-c147-49dc-8f9a-ffd4a6f07f90" }] }, "position": { "x": 850.0000000000011, "y": 2590.0000000000027 }, "size": { "width": 300, "height": 130 }, "dropDownCheckBox": [], "parent": "group_490b7b77" }, { "alias": "Glue_Responser_Parser", "name": "Glue_Responser_Parser", "description": "TOOL__C__Glue_Responser_Parser", "version": "1.0.0", "buildIn": false, "useGpu": false, "category": "TOOL", "config": { "module": "TOOL__C__Glue_Responser_Parser", "executor": "parse", "initParams": {}, "input": { "status": { "type": "int", "require": true, "alias": "status" } }, "output": { "message": { "type": "string", "alias": "message" } }, "group": [] }, "author": "sf-Sany", "updatedAt": "2022-07-21T05:03:56.951Z", "id": "8989a55c-1f87-404a-8135-58dab5225829", "_id": "FfSVdxh6bFjrCZKe", "createdAt": "2022-07-21T05:03:51.617Z", "ifShow": true, "customId": "node_86392e2f", "ports": { "groups": { "top": { "position": "top", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } }, "bottom": { "position": "bottom", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } } }, "items": [{ "customId": "port_a1e0e149", "group": "top", "label": { "direction": "input", "name": "status", "type": "int", "require": true, "alias": "status" }, "color": "#7a3f59", "id": "6015e6e3-466d-4099-ae40-413e5e2b4ee4" }, { "customId": "port_d5ae06df", "group": "bottom", "label": { "direction": "output", "name": "message", "type": "string", "alias": "message" }, "color": "#165b5c", "id": "a3a0a2a0-48e1-41c1-93fa-21e92497380f" }] }, "position": { "x": 550.0000000000011, "y": 1990.0000000000027 }, "size": { "width": 300, "height": 130 }, "dropDownCheckBox": [], "parent": "group_490b7b77" }, { "alias": "Business_Glue_Station", "name": "Business_Glue_Station", "description": "This is a business  plugin for Glue station", "version": "0.0.1", "buildIn": false, "useGpu": false, "category": "CV", "config": { "module": "CV__C__Business_Glue_Station", "executor": "Business_Glue_Station", "initParams": { "glue_width_max": { "name": "glue_width_max", "alias": "glue_width_max", "require": false, "value": 80, "type": "int", "widget": { "type": "InputNumber", "max": 300, "min": 0, "step": 1, "precision": 0 } }, "glue_width_min": { "name": "glue_width_min", "alias": "glue_width_min", "require": false, "value": 1, "type": "int", "widget": { "type": "InputNumber", "max": 300, "min": 0, "step": 1, "precision": 0 } } }, "input": { "srcImg": { "type": "numpy.ndarray", "require": true, "alias": "srcImg" }, "maskImg": { "type": "numpy.ndarray", "require": true, "alias": "maskImg" } }, "output": { "status": { "type": "int", "alias": "status" }, "showImg": { "type": "numpy.ndarray", "alias": "showImg" } }, "group": [] }, "author": "Sany-ShenFei", "updatedAt": "2022-07-21T05:10:19.588Z", "id": "00798d3e-b188-4dec-a9bb-094552db721b", "_id": "rwz6WHooi52rSoQo", "createdAt": "2022-07-21T05:00:31.271Z", "ifShow": true, "customId": "node_90cc8e9d", "ports": { "groups": { "top": { "position": "top", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } }, "bottom": { "position": "bottom", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } } }, "items": [{ "customId": "port_491f4c24", "group": "top", "label": { "direction": "input", "name": "srcImg", "type": "numpy.ndarray", "require": true, "alias": "srcImg" }, "color": "#1acccf", "id": "1a2addf1-bd70-47bd-99dd-c436db43a226" }, { "customId": "port_c8b102bf", "group": "top", "label": { "direction": "input", "name": "maskImg", "type": "numpy.ndarray", "require": true, "alias": "maskImg" }, "color": "#1acccf", "id": "0551c2e5-658e-4cb4-ba93-19afc1f138d1" }, { "customId": "port_e1b3adac", "group": "bottom", "label": { "direction": "output", "name": "status", "type": "int", "alias": "status" }, "color": "#7a3f59", "id": "a7f6b04f-baa7-4a5e-901c-d41889514c80" }, { "customId": "port_d4718e1c", "group": "bottom", "label": { "direction": "output", "name": "showImg", "type": "numpy.ndarray", "alias": "showImg" }, "color": "#1acccf", "id": "ce651fd7-c5f2-4e6b-a719-6f877a53ca65" }] }, "position": { "x": 880.0000000000011, "y": 1690.0000000000027 }, "size": { "width": 300, "height": 130 }, "dropDownCheckBox": [], "parent": "group_490b7b77" }, { "alias": "服务TCPServer", "name": "TcpServer", "description": "TCP服务插件，跟监听指定端口的请求，并根据\"默认异常响应信息\"和 \"异常中断响应表\" 进行响应", "version": "0.0.2", "buildIn": false, "useGpu": false, "category": "SERV", "config": { "module": "SERV__A__TcpServer", "executor": "TcpServer", "initParams": { "port": { "name": "port", "alias": "port", "require": true, "default": 2000, "value": 5547, "type": "int", "description": "监听端口", "widget": { "type": "InputNumber", "max": 65535, "min": 1000, "step": 1, "precision": 0 } }, "default_res_msg": { "name": "default_res_msg", "alias": "默认异常响应信息", "require": true, "default": "ERROR", "value": "ERROR", "type": "string", "description": "默认异常响应信息", "widget": { "type": "Input" } }, "response_template": { "name": "response_template", "alias": "异常中断响应表", "require": false, "default": "{}", "type": "string", "widget": { "type": "codeEditor" }, "value": "{}" } }, "input": {}, "output": { "message": { "type": "string", "alias": "message" } }, "group": [] }, "author": "liwen", "repository": "https://github.com/UBV/TcpServer", "bugs": "https://github.com/UBV/TcpServer/issues", "id": "bbdd935f-f587-4db9-ad66-f32caec4d18b", "_id": "1DBwzaY2tR0lAQ2J", "createdAt": "2022-06-21T10:16:06.395Z", "updatedAt": "2022-07-14T18:56:31.402Z", "ifShow": true, "customId": "node_45ed4f5c", "ports": { "groups": { "top": { "position": "top", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } }, "bottom": { "position": "bottom", "attrs": { "fo": { "r": 6, "magnet": true, "strokeWidth": 1, "fill": "#fff" } } } }, "items": [{ "customId": "port_688d2b5c", "group": "bottom", "label": { "direction": "output", "name": "message", "type": "string", "alias": "message" }, "color": "#165b5c", "id": "a0ae4b81-5784-4661-b4d5-400266424ccd" }] }, "position": { "x": 600, "y": 640 }, "dropDownCheckBox": [], "size": { "width": 300, "height": 130 } }], "listType": "block" }], "commonInfo": { "productionInfo": "涂布机正极", "stationInfo": "工位1A面", "useInfo": "尺寸测量与缺陷检测" }, "contentData": { "home": [{ "i": "header", "x": 0, "y": 0, "w": 0, "h": 0, "minW": 0, "maxW": 100, "minH": 0, "maxH": 100 }, { "i": "slider-1", "x": 0, "y": 0, "w": 9, "h": 10, "minW": 1, "maxW": 100, "minH": 2, "maxH": 100 }, { "i": "slider-4", "x": 9, "y": 0, "w": 87, "h": 2, "minW": 1, "maxW": 100, "minH": 2, "maxH": 100 }, { "i": "footer-1", "x": 2, "y": 14, "w": 0, "h": 0, "minW": 0, "maxW": 100, "minH": 0, "maxH": 100 }, { "i": "footer-2", "x": 0, "y": 32, "w": 9, "h": 12, "minW": 1, "maxW": 100, "minH": 2, "maxH": 100 }], "content": [{ "id": "45e063e4-8e3e-4e10-a1cd-48be6g78e97a$$laminationImage", "value": ["45e063e4-8e3e-4e10-a1cd-48be6g78e97a"], "size": { "i": "45e063e4-8e3e-4e10-a1cd-48be6g78e97a$$laminationImage", "x": 17.475, "y": 23.24, "w": 10, "h": 8, "minW": 1, "maxW": 100, "minH": 2, "maxH": 100 }, "type": "laminationImage", "ifShowHeader": false, "backgroundColor": "default", "titleBackgroundColor": "transparent", "titleFontSize": 20, "titlePaddingSize": 0, "bodyPaddingSize": 0, "fontSize": 12, "ifLocalStorage": true, "des_column": 3 }, { "id": "45e063e4-8e3e-4e10-a1cd-48be6g78e97a$$reJudgment", "value": ["45e063e4-8e3e-4e10-a1cd-48be6g78e97a"], "size": { "i": "45e063e4-8e3e-4e10-a1cd-48be6g78e97a$$reJudgment", "x": 28, "y": 2, "w": 67, "h": 36, "minW": 1, "maxW": 100, "minH": 2, "maxH": 100 }, "type": "reJudgment", "ifShowHeader": false, "backgroundColor": "default", "titleBackgroundColor": "transparent", "titleFontSize": 20, "titlePaddingSize": 0, "bodyPaddingSize": 0, "fontSize": 12, "ifLocalStorage": true, "fetchType": "post", "xName": "123/qwe" }], "footerSelectList": ["45e063e4-8d3e-4e10-a1cd-48be2f78e97a"], "theme": "dark", "ipList": [], "inIframe": false, "contentHeader": { "slider-1": false, "slider-2": true, "slider-3": true, "slider-4": false, "footer-1": true, "footer-2": true, "45e063e4-8e3e-4e10-a1cd-48be6g78e97a$$$$img": true }, "autoSize": true, "contentSize": { "width": 1600, "height": 900 }, "gridMargin": 8, "pageIconPosition": {}, "homeSetting": { "footer-1": { "fontSize": 14 }, "footer-2": { "fontSize": 20 }, "header": { "fontSize": 20, "headerTitleFontSize": 24 } } }, "environment": { "serviceIp": "localhost", "servicePort": "18080" }, "project_id": "9560c0ea" }
    // data: {"id":"b64512e","name":"FDX_GLUE_正式","description":"分动箱涂胶","plugin_path":"/opt/ubvision/tujiao/plugins","zoom":0.4200913242009132,"graphLock":false,"position":{"x":967.2173913043479,"y":-609.9999999999999},"flowData":{"groups":[{"position":{"x":310,"y":580},"size":{"width":1720,"height":280},"attrs":{"body":{"fill":"#2E394D"},"buttonSign":{"d":"M 2 5 8 5"},"label":{"text":"group_6a56067b"}},"id":"group_6a56067b","shape":"dag-group","customId":"group_6a56067b","childrenList":["3e41e3d3-2ef4-44fc-9771-d352e634dfdf"],"zIndex":0,"children":["3e41e3d3-2ef4-44fc-9771-d352e634dfdf"],"originPosition":{"x":310,"y":580},"originSize":{"width":1720,"height":280}},{"position":{"x":-340,"y":1100},"size":{"width":440,"height":1120},"attrs":{"body":{"fill":"#2E394D"},"buttonSign":{"d":"M 2 5 8 5"},"label":{"text":"group_e0278e38"}},"id":"group_e0278e38","shape":"dag-group","customId":"group_e0278e38","childrenList":["b78ac9ce-d8f4-4e76-84eb-f38cf12a992a","a1d8d2a3-3c96-4862-904e-a874bef76a57","b5fef33b-ede1-4d8a-888c-2bbfce294b98"],"zIndex":0,"children":["b78ac9ce-d8f4-4e76-84eb-f38cf12a992a","a1d8d2a3-3c96-4862-904e-a874bef76a57","b5fef33b-ede1-4d8a-888c-2bbfce294b98"],"originPosition":{"x":-340,"y":1100},"originSize":{"width":440,"height":1100}},{"position":{"x":320,"y":1020},"size":{"width":1770,"height":1810},"attrs":{"body":{"fill":"#2E394D"},"buttonSign":{"d":"M 2 5 8 5"},"label":{"text":"group_490b7b77"}},"id":"group_490b7b77","shape":"dag-group","customId":"group_490b7b77","childrenList":["c98381bf-8e21-443b-b241-ee8a07d11b7b","00798d3e-b188-4dec-a9bb-094552db721b","8989a55c-1f87-404a-8135-58dab5225829","b4f890bc-3254-4e03-a4bb-7e16b8d5534d","45e063e4-8d3e-4e10-a1cd-48be2f78e97a","56284350-1bc5-465f-b7d4-2c7fbe94097d","1f90147b-c49c-4884-803f-1c97f9824655","dc4e22e5-a1fe-4d99-9f2b-01367e813b1b"],"zIndex":0,"children":["c98381bf-8e21-443b-b241-ee8a07d11b7b","00798d3e-b188-4dec-a9bb-094552db721b","8989a55c-1f87-404a-8135-58dab5225829","b4f890bc-3254-4e03-a4bb-7e16b8d5534d","45e063e4-8d3e-4e10-a1cd-48be2f78e97a","56284350-1bc5-465f-b7d4-2c7fbe94097d","1f90147b-c49c-4884-803f-1c97f9824655","dc4e22e5-a1fe-4d99-9f2b-01367e813b1b"],"originPosition":{"x":320,"y":1020},"originSize":{"width":1770,"height":1810}}],"nodes":[{"name":"LogAnalyzer","alias":"日志分析Analyzer","version":"2.0.0","id":"45e063e4-8e3e-4e10-a1cd-48be6g78e97a","category":"Callback","description":"用于ubv运行日志分析，目前仅支持耗时分析，后续版本将加入异常分析等功能","author":"liwen","config":{"module":"B__LogAnalyzer","executor":"LogAnalyzer","initParams":{"log_file":{"name":"log_file","alias":"日志文件","orderId":0,"require":true,"default":"","type":"File","widget":{"type":"File","id":"log_file","suffix":["log"]}},"start_time":{"name":"start_time","alias":"开始时间","orderId":1,"require":false,"default":0,"value":0,"type":"int","widget":{"type":"DatePicker"}},"end_time":{"name":"end_time","alias":"结束时间","orderId":2,"require":false,"default":1691027321043,"value":1691027321043,"type":"int","widget":{"type":"DatePicker"}}},"execParams":{"log_file":{"name":"log_file","alias":"日志文件","orderId":0,"require":true,"default":"","type":"File","widget":{"type":"File","id":"log_file","suffix":["log"]}},"start_time":{"name":"start_time","alias":"开始时间","orderId":1,"require":false,"default":0,"value":0,"type":"int","widget":{"type":"DatePicker"}},"end_time":{"name":"end_time","alias":"结束时间","orderId":2,"require":false,"default":1691027321043,"value":1691027321043,"type":"int","widget":{"type":"DatePicker"}}},"input":{"cond":{"type":"dict","require":true,"alias":"执行信息"}},"output":{"data":{"type":"list","alias":"data"},"percent":{"type":"list","alias":"percent"},"trend_data":{"type":"list","alias":"趋势数据"}},"group":[]},"buildIn":false},{"name":"ImageStorge","version":"0.0.2","category":"DS","description":"This is a DataStorage plugin","author":"liwen","config":{"module":"DS__A__ImageStorge","executor":"ImageStorge","initParams":{"store_dir":{"name":"store_dir","alias":"存图目录","require":true,"onHidden":true,"default":"/tmp/ubvision","value":"/data/pangu-fs/track-inspect","type":"Dir","description":"选择一个存图目录","widget":{"type":"Dir"}},"target_format":{"name":"target_format","alias":"存图格式","require":true,"default":"jpg","value":".jpg","type":"List[string]","widget":{"type":"Radio","options":[".jpg",".png",".bmp"]}},"platForm_723b3e19":{"name":"platForm_723b3e19","alias":"platForm_723b3e19","orderId":5,"require":false,"default":"/Users/wilr/Downloads/201656991026_.pic_hd.jpg","localPath":"https://seopic.699pic.com/photo/40015/5662.jpg_wh1201.jpg","type":"File","description":"标注","widget":{"type":"ImageLabelField","options":{"horizontal_electrode":{"measurement":{"id":"Measurement_f6c171ac","name":"Measurement_f6c171ac","alias":"Measurement_f6c171ac","orderId":1,"require":false,"default":{"标准值":{"alias":"标准值","value":1},"正公差":{"alias":"正公差","value":2},"负公差":{"alias":"负公差","value":3},"补偿值":{"alias":"补偿值","value":4}},"value":{"标准值":{"alias":"标准值","value":1},"正公差":{"alias":"正公差","value":2},"负公差":{"alias":"负公差","value":3},"补偿值":{"alias":"补偿值","value":4}},"type":"float","widget":{"type":"Measurement"}},"gradient_threshold":{"name":"gradient_threshold","alias":"gradient_threshold","require":true,"default":15,"value":15,"type":"int","description":"数值","widget":{"type":"InputNumber","max":99999,"min":0,"step":1}},"search_direction":{"name":"search_direction","alias":"search_direction","require":true,"default":0,"value":0,"type":"int","description":"数值","widget":{"type":"InputNumber","max":99999,"min":0,"step":1}},"change_mode":{"name":"search_direction","alias":"search_direction","require":true,"default":2,"value":2,"type":"int","description":"数值","widget":{"type":"InputNumber","max":99999,"min":0,"step":1}}},"horizontal_diaphram":{"measurement":{"id":"Measurement_f6c171ac","name":"Measurement_f6c171ac","alias":"Measurement_f6c171ac","orderId":1,"require":false,"default":{"标准值":{"alias":"标准值","value":1},"正公差":{"alias":"正公差","value":2},"负公差":{"alias":"负公差","value":3},"补偿值":{"alias":"补偿值","value":4}},"value":{"标准值":{"alias":"标准值","value":1},"正公差":{"alias":"正公差","value":2},"负公差":{"alias":"负公差","value":3},"补偿值":{"alias":"补偿值","value":4}},"type":"float","widget":{"type":"Measurement"}},"gradient_threshold":{"name":"gradient_threshold","alias":"gradient_threshold","require":true,"default":16,"value":16,"type":"int","description":"数值","widget":{"type":"InputNumber","max":99999,"min":0,"step":1}},"search_direction":{"name":"search_direction","alias":"search_direction","require":true,"default":0,"value":1,"type":"int","description":"数值","widget":{"type":"InputNumber","max":99999,"min":0,"step":1}},"change_mode":{"name":"search_direction","alias":"search_direction","require":true,"default":1,"value":1,"type":"int","description":"数值","widget":{"type":"InputNumber","max":99999,"min":0,"step":1}}},"vertical_electrode":{"measurement":{"id":"Measurement_f6c171ac","name":"Measurement_f6c171ac","alias":"Measurement_f6c171ac","orderId":1,"require":false,"default":{"标准值":{"alias":"标准值","value":1},"正公差":{"alias":"正公差","value":2},"负公差":{"alias":"负公差","value":3},"补偿值":{"alias":"补偿值","value":4}},"value":{"标准值":{"alias":"标准值","value":1},"正公差":{"alias":"正公差","value":2},"负公差":{"alias":"负公差","value":3},"补偿值":{"alias":"补偿值","value":4}},"type":"float","widget":{"type":"Measurement"}},"gradient_threshold":{"name":"gradient_threshold","alias":"gradient_threshold","require":true,"default":18,"value":18,"type":"int","description":"数值","widget":{"type":"InputNumber","max":99999,"min":0,"step":1}},"search_direction":{"name":"search_direction","alias":"search_direction","require":true,"default":0,"value":0,"type":"int","description":"数值","widget":{"type":"InputNumber","max":99999,"min":0,"step":1}},"change_mode":{"name":"search_direction","alias":"search_direction","require":true,"default":3,"value":3,"type":"int","description":"数值","widget":{"type":"InputNumber","max":99999,"min":0,"step":1}}}}}},"platForm_7223e19":{"name":"platForm_7223e19","alias":"platForm_7223e19","orderId":5,"require":false,"default":"/Users/wilr/Downloads/201656991026_.pic_hd.jpg","localPath":"https://seopic.699pic.com/photo/40015/5662.jpg_wh1200.jpg","type":"File","description":"标注","widget":{"type":"ImageLabelField","id":"platForm_723b3e19"}}},"input":{"src_img":{"type":"numpy.ndarray","require":true,"alias":"src_img"},"category":{"type":"string","require":false,"alias":"category"},"img_name":{"type":"string","require":false,"alias":"img_name"}},"output":{"status":{"type":"bool","alias":"status123123123qwe"},"category":{"type":"string","alias":"category"},"store_path":{"type":"string","alias":"store_path"}}},"alias":"图片存储器ImgStorge","buildIn":false,"useGpu":false,"id":"45e063e4-8d3e-4e10-a1cd-48be2f78e97a","_id":"SNF8MEF6cMipAYTE","createdAt":"2022-06-21T10:15:17.282Z","updatedAt":"2022-06-21T10:17:15.705Z","ifShow":true,"customId":"node_d732fd33","ports":{"groups":{"top":{"position":"top","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}},"bottom":{"position":"bottom","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}}},"items":[{"customId":"port_1f452085","group":"top","label":{"direction":"input","name":"src_img","type":"numpy.ndarray","require":true,"alias":"src_img"},"color":"#1acccf","id":"71cb731c-4648-41d6-933a-946f2a0db521"},{"customId":"port_ac4beda0","group":"top","label":{"direction":"input","name":"category","type":"string","require":false,"alias":"category"},"color":"#165b5c","id":"e5d20ecc-b2dc-4d2f-a7b4-bf0ecc1bcaa6"},{"customId":"port_b1ee47eb","group":"top","label":{"direction":"input","name":"img_name","type":"string","require":false,"alias":"img_name"},"color":"#165b5c","id":"e7e1dabe-8ba7-4c39-a787-f0fbbcd4cfba"},{"customId":"port_b86c9517","group":"bottom","label":{"direction":"output","name":"status","type":"bool","alias":"status"},"color":"#7d573a","id":"f409838a-abbb-4f7e-8e14-98432257447a"},{"customId":"port_1a110c28","group":"bottom","label":{"direction":"output","name":"category","type":"string","alias":"category"},"color":"#165b5c","id":"d87d04e9-331f-4334-922d-6c826211a848"},{"customId":"port_508b1d0d","group":"bottom","label":{"direction":"output","name":"store_path","type":"string","alias":"store_path"},"color":"#165b5c","id":"5c66b076-ef20-4c1e-8c41-683c8ba170b2"}]},"position":{"x":1060.0000000000011,"y":2000.0000000000027},"dropDownCheckBox":["result"],"size":{"width":480,"height":370},"parent":"group_490b7b77"},{"name":"ImageStorge.json","version":"0.0.2","category":"DS","description":"This is a DataStorage plugin","author":"liwen","config":{"module":"DS__A__ImageStorge","executor":"ImageStorge","initParams":{"store_dir":{"name":"store_dir","alias":"存图目录","require":true,"onHidden":true,"default":"/tmp/ubvision","value":"/data/simulate/images","type":"Dir","description":"选择一个存图目录","widget":{"type":"Dir"}},"target_format":{"name":"target_format","alias":"存图格式","require":true,"default":"jpg","value":".jpg","type":"List[string]","widget":{"type":"Radio","options":[".jpg",".png",".bmp"]}}},"input":{"src_img":{"type":"numpy.ndarray","require":true,"alias":"src_img"},"category":{"type":"string","require":false,"alias":"category"},"img_name":{"type":"string","require":false,"alias":"img_name"}},"output":{"status":{"type":"bool","alias":"status"},"category":{"type":"string","alias":"category"},"store_path":{"type":"string","alias":"store_path"}},"group":[]},"alias":"图片存储器ImgStorge.json","buildIn":false,"useGpu":false,"id":"56284350-1bc5-465f-b7d4-2c7fbe94097d","_id":"SNF8MEF6cMipAYTE","createdAt":"2022-06-21T10:15:17.282Z","updatedAt":"2022-07-13T11:02:57.716Z","ifShow":true,"customId":"node_5f987d1b","ports":{"groups":{"top":{"position":"top","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}},"bottom":{"position":"bottom","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}}},"items":[{"customId":"port_b3a9431b","group":"top","label":{"direction":"input","name":"src_img","type":"numpy.ndarray","require":true,"alias":"src_img"},"color":"#1acccf","id":"7c77e391-3961-4bbb-b009-a347149b449e"},{"customId":"port_264baf3a","group":"top","label":{"direction":"input","name":"category","type":"string","require":false,"alias":"category"},"color":"#165b5c","id":"c74b7ffb-9cab-4583-92ec-9700ce552318"},{"customId":"port_0ddb2da7","group":"top","label":{"direction":"input","name":"img_name","type":"string","require":false,"alias":"img_name"},"color":"#165b5c","id":"9c65211b-8867-4cb5-8f39-8a21cee512ce"},{"customId":"port_4f452295","group":"bottom","label":{"direction":"output","name":"status","type":"bool","alias":"status"},"color":"#7d573a","id":"5bdac4c1-3403-47c9-b7a4-7e5fb789559b"},{"customId":"port_a20d197c","group":"bottom","label":{"direction":"output","name":"category","type":"string","alias":"category"},"color":"#165b5c","id":"28eae3a6-f1d8-4e16-88c9-6e385cac052f"},{"customId":"port_854a6544","group":"bottom","label":{"direction":"output","name":"store_path","type":"string","alias":"store_path"},"color":"#165b5c","id":"14306f65-e705-4ca7-8769-cc093726a35c"}]},"position":{"x":830.0000000000011,"y":1370.0000000000027},"size":{"width":444,"height":130},"dropDownCheckBox":["result"],"parent":"group_490b7b77"},{"name":"Responser.json","version":"0.0.1","category":"COMM","description":"This is COMM Responser","author":"lw-Sany","repository":"https://github.com/UBV/ResultParser","bugs":"https://github.com/UBV/ResultParser/issues","config":{"module":"COMM__A__Responser","executor":"Responser","initParams":{"respond_to":{"name":"respond_to","alias":"respond_to","require":false,"type":"string","widget":{"type":"Input"},"value":"1fbf97c8-d887-43a5-8f2c-ed198e098b8b"}},"input":{"response":{"type":"string","require":true,"alias":"response"}},"output":{}},"alias":"TCP-Responser.json","buildIn":false,"useGpu":false,"codeEditor":false,"id":"b4f890bc-3254-4e03-a4bb-7e16b8d5534d","_id":"IIPdi27QjBzC76Ag","createdAt":"2022-06-05T15:14:02.102Z","updatedAt":"2022-07-13T11:03:30.387Z","ifShow":true,"customId":"node_bf76a6ee","ports":{"groups":{"top":{"position":"top","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}},"bottom":{"position":"bottom","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}}},"items":[{"customId":"port_7987924e","group":"top","label":{"direction":"input","name":"response","type":"string","require":true,"alias":"response"},"color":"#165b5c","id":"b6e929c7-606a-477d-9de1-9c5751936aca"}]},"position":{"x":540.0000000000011,"y":2280.0000000000027},"size":{"width":300,"height":130},"dropDownCheckBox":[],"parent":"group_490b7b77"},{"name":"Glue_Trigger_Parser","version":"1.0.0","category":"TOOL","description":"TOOL__C__Glue_Trigger_Parser","author":"sf-Sany","config":{"module":"TOOL__C__Glue_Trigger_Parser","executor":"parse","initParams":{},"input":{"origin_str":{"type":"string","require":true,"alias":"origin_str"}},"output":{"camera":{"type":"string","alias":"camera"},"heart":{"type":"string","alias":"heart"}},"group":[]},"updatedAt":"2022-07-13T13:14:32.108Z","id":"3e41e3d3-2ef4-44fc-9771-d352e634dfdf","_id":"cONUuPsSLoL8Rx5F","createdAt":"2022-07-13T13:14:24.753Z","alias":"Glue_Trigger_Parser","buildIn":false,"useGpu":false,"ifShow":true,"customId":"node_d2946b47","ports":{"groups":{"top":{"position":"top","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}},"bottom":{"position":"bottom","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}}},"items":[{"customId":"port_57fac917","group":"top","label":{"direction":"input","name":"origin_str","type":"string","require":true,"alias":"origin_str"},"color":"#165b5c","id":"627134a1-328f-4aa2-8125-efef9f5b23ec"},{"customId":"port_b8f22edb","group":"bottom","label":{"direction":"output","name":"camera","type":"string","alias":"camera"},"color":"#165b5c","id":"c2aeed53-807a-49ea-b265-6f0f206064d6"},{"customId":"port_0c5a998c","group":"bottom","label":{"direction":"output","name":"heart","type":"string","alias":"heart"},"color":"#165b5c","id":"8852db72-a768-43d3-b57d-be7443a0202b"}]},"position":{"x":1380,"y":650.0000000000003},"size":{"width":300,"height":130},"dropDownCheckBox":[],"parent":"group_6a56067b"},{"alias":"AIEngine","name":"AIEngine","description":"This is an ai engine plugin for industrial visual quality inspection\n2022.7.1","version":"0.1.0","buildIn":false,"useGpu":true,"category":"CV","config":{"module":"CV__B__AIEngine","executor":"AIEngine","initParams":{"config_path":{"name":"config_path","alias":"config_path","require":false,"type":"File","widget":{"type":"File","suffix":[".jpg/.jpeg",".png",".svg",".pdf",".pt",".py",".doc/.docx",".csv",".bmp",".json","all"]},"value":"/opt/ubvision/tujiao/resources/configs/seg_swin_transformer_st_tujiao.json"},"model_path":{"name":"model_path","alias":"model_path","require":false,"type":"File","widget":{"type":"File","suffix":[".jpg/.jpeg",".png",".svg",".pdf",".pt",".py",".doc/.docx",".csv",".bmp",".json","all"]},"value":"/opt/ubvision/tujiao/resources/models/iter_44000_w1024xh1024_sim_fp32.engine"}},"input":{"srcImg":{"type":"numpy.ndarray","require":true,"alias":"srcImg"}},"output":{"class_name":{"type":"list","alias":"class_name"},"masks":{"type":"numpy.ndarray","alias":"masks"},"shapes":{"type":"dict","alias":"shapes"},"status":{"type":"bool","alias":"status"}},"group":[]},"author":"zwt-Sany","repository":"https://github.com/QIVG/AlgorithmPluginDemo","bugs":"https://github.com/QIVG/AlgorithmPluginDemo/issues","_id":"Ug3bhG8x9kYJHpGM","createdAt":"2022-06-17T13:08:34.434Z","updatedAt":"2022-07-14T18:56:31.404Z","id":"1f90147b-c49c-4884-803f-1c97f9824655","ifShow":true,"customId":"node_84079990","ports":{"groups":{"top":{"position":"top","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}},"bottom":{"position":"bottom","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}}},"items":[{"customId":"port_c79f6953","group":"top","label":{"direction":"input","name":"srcImg","type":"numpy.ndarray","require":true,"alias":"srcImg"},"color":"#1acccf","id":"32f85b78-82b7-4bd8-b2c9-43a3a5a7903f"},{"customId":"port_e9d93c82","group":"bottom","label":{"direction":"output","name":"class_name","type":"list","alias":"class_name"},"color":"#694256","id":"ffde9a57-9e5b-43a2-aeef-47e4f0fb0c8e"},{"customId":"port_5d4da216","group":"bottom","label":{"direction":"output","name":"masks","type":"numpy.ndarray","alias":"masks"},"color":"#1acccf","id":"3419b89d-70be-479c-9877-75ce3bcfdf98"},{"customId":"port_7d268669","group":"bottom","label":{"direction":"output","name":"shapes","type":"dict","alias":"shapes"},"color":"#425e7e","id":"a9186b9f-850a-4a0b-8eb2-aa9ad5ee9c6d"},{"customId":"port_369b74fd","group":"bottom","label":{"direction":"output","name":"status","type":"bool","alias":"status"},"color":"#7d573a","id":"d6bdeada-adea-41de-8f90-426e5c945318"}]},"position":{"x":1380.0000000000011,"y":1350.0000000000027},"size":{"width":592,"height":130},"dropDownCheckBox":[],"parent":"group_490b7b77"},{"alias":"GalaxyCamera","name":"GalaxyCamera","description":"GalaxyCamera","version":"0.1.0","buildIn":false,"useGpu":false,"category":"CAPTURE","config":{"module":"CAPTURE__B__GalaxyCamera","executor":"Camera","initParams":{"camera_name":{"name":"camera_name","alias":"camera_name","require":false,"default":"DefaultCam","value":"DefaultCam","type":"string","widget":{"type":"Input"}},"serial_number":{"name":"serial_number","alias":"serial_number","require":true,"default":" ","value":"LT0210051918","type":"string","widget":{"type":"Input"}},"exposure_time":{"name":"exposure_time","alias":"exposure_time","require":true,"default":5000,"value":1500,"type":"int","widget":{"type":"InputNumber","max":100000,"min":500,"step":100,"precision":0}},"data_format":{"name":"data_format","alias":"data_format","require":false,"default":"RGB","value":"RGB","type":"List[string]","widget":{"type":"Radio","options":["RGB","GRAY","RAW"]}},"interval_time":{"name":"interval_time","alias":"interval_time","require":true,"default":0,"type":"float","widget":{"type":"InputNumber","max":5,"min":0,"step":0.05,"precision":2},"value":0.1},"width":{"type":"float","default":2048,"require":false,"widget":{"type":"InputNumber","max":6000,"min":100,"step":1,"precision":1},"value":5496,"alias":"width","name":"width"},"height":{"type":"float","default":2048,"require":false,"widget":{"type":"InputNumber","max":6000,"min":100,"step":1,"precision":1},"value":3672,"alias":"height","name":"height"},"DEV_MAPPER":{"type":"str","default":"/dev/bus/usb","value":"/dev/bus/usb","require":true,"widget":{"type":"Input"},"alias":"DEV_MAPPER","name":"DEV_MAPPER"},"NETWORKMODE":{"default":"host","require":true,"value":"host","type":"List[string]","widget":{"type":"Radio","options":["host","bridge"]},"alias":"NETWORKMODE","name":"NETWORKMODE"},"Gain":{"name":"Gain","alias":"Gain","require":true,"default":10,"value":10,"type":"float","widget":{"type":"Slider","max":20,"min":0.1,"step":0.1}}},"input":{"signal":{"type":"string","require":true,"alias":"signal"}},"output":{"frame":{"type":"numpy.ndarray","alias":"frame"},"category":{"type":"string","alias":"category"},"status":{"type":"bool","alias":"status"}},"group":[{"id":"76a2eea9","open":false,"children":["NETWORKMODE","DEV_MAPPER"],"name":"Advanced Options"}]},"author":"liwen","_id":"UEpwqYTvke6un0Rs","createdAt":"2022-07-10T03:06:07.682Z","updatedAt":"2022-07-15T07:45:51.867Z","id":"c98381bf-8e21-443b-b241-ee8a07d11b7b","ifShow":true,"customId":"node_0bb7ada6","ports":{"groups":{"top":{"position":"top","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}},"bottom":{"position":"bottom","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}}},"items":[{"customId":"port_b776d46c","group":"top","label":{"direction":"input","name":"signal","type":"string","require":true,"alias":"signal"},"color":"#165b5c","id":"8c3b5c46-5934-496d-ac5f-d8b1ca403188"},{"customId":"port_42c40766","group":"bottom","label":{"direction":"output","name":"frame","type":"numpy.ndarray","alias":"frame"},"color":"#1acccf","id":"7961fb07-7eec-443e-91c5-6a3177732566"},{"customId":"port_a7b8fbcc","group":"bottom","label":{"direction":"output","name":"category","type":"string","alias":"category"},"color":"#165b5c","id":"51510414-8a0c-49f6-a6b0-3eec528bed65"},{"customId":"port_ddc16065","group":"bottom","label":{"direction":"output","name":"status","type":"bool","alias":"status"},"color":"#7d573a","id":"7837188d-ec7e-440a-b1d1-396334560acf"}]},"position":{"x":810.0000000000011,"y":1060.0000000000027},"size":{"width":444,"height":130},"dropDownCheckBox":[],"parent":"group_490b7b77"},{"alias":"服务TCPServer","name":"TcpServer","description":"TCP服务插件，跟监听指定端口的请求，并根据\"默认异常响应信息\"和 \"异常中断响应表\" 进行响应","version":"0.0.2","buildIn":false,"useGpu":false,"category":"SERV","config":{"module":"SERV__A__TcpServer","executor":"TcpServer","initParams":{"port":{"name":"port","alias":"port","require":true,"default":2000,"value":5546,"type":"int","description":"监听端口","widget":{"type":"InputNumber","max":65535,"min":1000,"step":1,"precision":0}},"default_res_msg":{"name":"default_res_msg","alias":"默认异常响应信息","require":true,"default":"ERROR","value":"ERROR","type":"string","description":"默认异常响应信息","widget":{"type":"Input"}},"response_template":{"name":"response_template","alias":"异常中断响应表","require":false,"default":"{}","type":"string","widget":{"type":"codeEditor"},"value":"{}"}},"input":{},"output":{"message":{"type":"string","alias":"message"}},"group":[]},"author":"liwen","repository":"https://github.com/UBV/TcpServer","bugs":"https://github.com/UBV/TcpServer/issues","id":"a1d8d2a3-3c96-4862-904e-a874bef76a57","_id":"1DBwzaY2tR0lAQ2J","createdAt":"2022-06-21T10:16:06.395Z","updatedAt":"2022-07-14T18:56:31.402Z","ifShow":true,"customId":"node_72eca6e4","ports":{"groups":{"top":{"position":"top","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}},"bottom":{"position":"bottom","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}}},"items":[{"customId":"port_82c0c610","group":"bottom","label":{"direction":"output","name":"message","type":"string","alias":"message"},"color":"#165b5c","id":"9591d6e0-64ca-4d8c-b42b-29f439ac3e0f"}]},"position":{"x":-240,"y":1160},"size":{"width":300,"height":130},"dropDownCheckBox":[],"parent":"group_e0278e38"},{"alias":"Glue_Trigger_Parser","name":"Glue_Trigger_Parser","description":"TOOL__C__Glue_Trigger_Parser","version":"1.0.0","buildIn":false,"useGpu":false,"category":"TOOL","config":{"module":"TOOL__C__Glue_Trigger_Parser","executor":"parse","initParams":{},"input":{"origin_str":{"type":"string","require":true,"alias":"origin_str"}},"output":{"camera":{"type":"string","alias":"camera"},"heart":{"type":"string","alias":"heart"}},"group":[]},"author":"sf-Sany","updatedAt":"2022-07-19T11:58:18.297Z","id":"b5fef33b-ede1-4d8a-888c-2bbfce294b98","_id":"ywHaV9aVLeaakgcn","createdAt":"2022-07-19T11:57:49.555Z","ifShow":true,"customId":"node_1f183bca","ports":{"groups":{"top":{"position":"top","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}},"bottom":{"position":"bottom","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}}},"items":[{"customId":"port_ec6ea7e6","group":"top","label":{"direction":"input","name":"origin_str","type":"string","require":true,"alias":"origin_str"},"color":"#165b5c","id":"88ffbb5b-d26a-42d3-9f91-337e0436d92a"},{"customId":"port_90b1f6d0","group":"bottom","label":{"direction":"output","name":"camera","type":"string","alias":"camera"},"color":"#165b5c","id":"fbcc3c56-0d77-4a49-adf0-2dbf14f03400"},{"customId":"port_4a8425fd","group":"bottom","label":{"direction":"output","name":"heart","type":"string","alias":"heart"},"color":"#165b5c","id":"058e4bdb-167e-48f4-9188-3273baff14e4"}]},"position":{"x":-250,"y":1600},"size":{"width":300,"height":130},"dropDownCheckBox":[],"parent":"group_e0278e38"},{"alias":"TCP-Responser","name":"Responser","description":"This is COMM Responser","version":"0.0.1","buildIn":false,"useGpu":false,"category":"COMM","config":{"module":"COMM__A__Responser","executor":"Responser","initParams":{"respond_to":{"name":"respond_to","alias":"respond_to","require":false,"type":"string","widget":{"type":"Input"},"value":"a1d8d2a3-3c96-4862-904e-a874bef76a57"}},"input":{"response":{"type":"string","require":true,"alias":"response"}},"output":{}},"author":"lw-Sany","repository":"https://github.com/UBV/ResultParser","bugs":"https://github.com/UBV/ResultParser/issues","codeEditor":false,"id":"b78ac9ce-d8f4-4e76-84eb-f38cf12a992a","_id":"IIPdi27QjBzC76Ag","createdAt":"2022-06-05T15:14:02.102Z","updatedAt":"2022-07-14T18:56:31.401Z","ifShow":true,"customId":"node_8a9c1478","ports":{"groups":{"top":{"position":"top","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}},"bottom":{"position":"bottom","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}}},"items":[{"customId":"port_59b0c7f5","group":"top","label":{"direction":"input","name":"response","type":"string","require":true,"alias":"response"},"color":"#165b5c","id":"b97034ff-227c-4f7f-bb0d-8ad3248ba819"}]},"position":{"x":-240,"y":2050},"size":{"width":300,"height":130},"dropDownCheckBox":[],"parent":"group_e0278e38"},{"alias":"DataServer","name":"DataServer","description":"This is a DataServer plugin","version":"0.0.1","buildIn":false,"useGpu":false,"category":"TOOL","config":{"module":"TOOL__C__DataServer","executor":"DataServer","initParams":{},"input":{"status":{"type":"int","require":true,"alias":"status"},"show_img_path":{"type":"string","require":false,"alias":"show_img_path"}},"output":{},"group":[]},"author":"liwen","updatedAt":"2022-07-21T04:56:06.372Z","_id":"bf1BpfxQGLUzkw2c","createdAt":"2022-07-14T01:21:14.656Z","id":"dc4e22e5-a1fe-4d99-9f2b-01367e813b1b","ifShow":true,"customId":"node_45487823","ports":{"groups":{"top":{"position":"top","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}},"bottom":{"position":"bottom","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}}},"items":[{"customId":"port_efc2214c","group":"top","label":{"direction":"input","name":"status","type":"int","require":true,"alias":"status"},"color":"#7a3f59","id":"91a87f00-4441-4857-8dae-dfc363367917"},{"customId":"port_25177c19","group":"top","label":{"direction":"input","name":"show_img_path","type":"string","require":false,"alias":"show_img_path"},"color":"#165b5c","id":"2712f986-c147-49dc-8f9a-ffd4a6f07f90"}]},"position":{"x":850.0000000000011,"y":2590.0000000000027},"size":{"width":300,"height":130},"dropDownCheckBox":[],"parent":"group_490b7b77"},{"alias":"Glue_Responser_Parser","name":"Glue_Responser_Parser","description":"TOOL__C__Glue_Responser_Parser","version":"1.0.0","buildIn":false,"useGpu":false,"category":"TOOL","config":{"module":"TOOL__C__Glue_Responser_Parser","executor":"parse","initParams":{},"input":{"status":{"type":"int","require":true,"alias":"status"}},"output":{"message":{"type":"string","alias":"message"}},"group":[]},"author":"sf-Sany","updatedAt":"2022-07-21T05:03:56.951Z","id":"8989a55c-1f87-404a-8135-58dab5225829","_id":"FfSVdxh6bFjrCZKe","createdAt":"2022-07-21T05:03:51.617Z","ifShow":true,"customId":"node_86392e2f","ports":{"groups":{"top":{"position":"top","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}},"bottom":{"position":"bottom","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}}},"items":[{"customId":"port_a1e0e149","group":"top","label":{"direction":"input","name":"status","type":"int","require":true,"alias":"status"},"color":"#7a3f59","id":"6015e6e3-466d-4099-ae40-413e5e2b4ee4"},{"customId":"port_d5ae06df","group":"bottom","label":{"direction":"output","name":"message","type":"string","alias":"message"},"color":"#165b5c","id":"a3a0a2a0-48e1-41c1-93fa-21e92497380f"}]},"position":{"x":550.0000000000011,"y":1990.0000000000027},"size":{"width":300,"height":130},"dropDownCheckBox":[],"parent":"group_490b7b77"},{"alias":"Business_Glue_Station","name":"Business_Glue_Station","description":"This is a business  plugin for Glue station","version":"0.0.1","buildIn":false,"useGpu":false,"category":"CV","config":{"module":"CV__C__Business_Glue_Station","executor":"Business_Glue_Station","initParams":{"glue_width_max":{"name":"glue_width_max","alias":"glue_width_max","require":false,"value":80,"type":"int","widget":{"type":"InputNumber","max":300,"min":0,"step":1,"precision":0}},"glue_width_min":{"name":"glue_width_min","alias":"glue_width_min","require":false,"value":1,"type":"int","widget":{"type":"InputNumber","max":300,"min":0,"step":1,"precision":0}}},"input":{"srcImg":{"type":"numpy.ndarray","require":true,"alias":"srcImg"},"maskImg":{"type":"numpy.ndarray","require":true,"alias":"maskImg"}},"output":{"status":{"type":"int","alias":"status"},"showImg":{"type":"numpy.ndarray","alias":"showImg"}},"group":[]},"author":"Sany-ShenFei","updatedAt":"2022-07-21T05:10:19.588Z","id":"00798d3e-b188-4dec-a9bb-094552db721b","_id":"rwz6WHooi52rSoQo","createdAt":"2022-07-21T05:00:31.271Z","ifShow":true,"customId":"node_90cc8e9d","ports":{"groups":{"top":{"position":"top","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}},"bottom":{"position":"bottom","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}}},"items":[{"customId":"port_491f4c24","group":"top","label":{"direction":"input","name":"srcImg","type":"numpy.ndarray","require":true,"alias":"srcImg"},"color":"#1acccf","id":"1a2addf1-bd70-47bd-99dd-c436db43a226"},{"customId":"port_c8b102bf","group":"top","label":{"direction":"input","name":"maskImg","type":"numpy.ndarray","require":true,"alias":"maskImg"},"color":"#1acccf","id":"0551c2e5-658e-4cb4-ba93-19afc1f138d1"},{"customId":"port_e1b3adac","group":"bottom","label":{"direction":"output","name":"status","type":"int","alias":"status"},"color":"#7a3f59","id":"a7f6b04f-baa7-4a5e-901c-d41889514c80"},{"customId":"port_d4718e1c","group":"bottom","label":{"direction":"output","name":"showImg","type":"numpy.ndarray","alias":"showImg"},"color":"#1acccf","id":"ce651fd7-c5f2-4e6b-a719-6f877a53ca65"}]},"position":{"x":880.0000000000011,"y":1690.0000000000027},"size":{"width":300,"height":130},"dropDownCheckBox":[],"parent":"group_490b7b77"},{"alias":"服务TCPServer","name":"TcpServer","description":"TCP服务插件，跟监听指定端口的请求，并根据\"默认异常响应信息\"和 \"异常中断响应表\" 进行响应","version":"0.0.2","buildIn":false,"useGpu":false,"category":"SERV","config":{"module":"SERV__A__TcpServer","executor":"TcpServer","initParams":{"port":{"name":"port","alias":"port","require":true,"default":2000,"value":5547,"type":"int","description":"监听端口","widget":{"type":"InputNumber","max":65535,"min":1000,"step":1,"precision":0}},"default_res_msg":{"name":"default_res_msg","alias":"默认异常响应信息","require":true,"default":"ERROR","value":"ERROR","type":"string","description":"默认异常响应信息","widget":{"type":"Input"}},"response_template":{"name":"response_template","alias":"异常中断响应表","require":false,"default":"{}","type":"string","widget":{"type":"codeEditor"},"value":"{}"}},"input":{},"output":{"message":{"type":"string","alias":"message"}},"group":[]},"author":"liwen","repository":"https://github.com/UBV/TcpServer","bugs":"https://github.com/UBV/TcpServer/issues","id":"bbdd935f-f587-4db9-ad66-f32caec4d18b","_id":"1DBwzaY2tR0lAQ2J","createdAt":"2022-06-21T10:16:06.395Z","updatedAt":"2022-07-14T18:56:31.402Z","ifShow":true,"customId":"node_45ed4f5c","ports":{"groups":{"top":{"position":"top","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}},"bottom":{"position":"bottom","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}}},"items":[{"customId":"port_688d2b5c","group":"bottom","label":{"direction":"output","name":"message","type":"string","alias":"message"},"color":"#165b5c","id":"a0ae4b81-5784-4661-b4d5-400266424ccd"}]},"position":{"x":600,"y":640},"dropDownCheckBox":[],"size":{"width":300,"height":130}}],"edges":[{"shape":"dag-edge","attrs":{"line":{"stroke":"#165b5c","strokeWidth":6,"strokeDasharray":""}},"zIndex":0,"id":"31632592-8086-42b8-938a-de01e4ed5ba8","parent":"group_e0278e38","data":{"status":"STOPPED","graphLock":false,"guid":"4f97ab41"},"source":{"cell":"b5fef33b-ede1-4d8a-888c-2bbfce294b98","port":"058e4bdb-167e-48f4-9188-3273baff14e4"},"target":{"cell":"b78ac9ce-d8f4-4e76-84eb-f38cf12a992a","port":"b97034ff-227c-4f7f-bb0d-8ad3248ba819"}},{"shape":"dag-edge","attrs":{"line":{"stroke":"#165b5c","strokeWidth":6,"strokeDasharray":""}},"zIndex":0,"id":"daec7b08-45f6-4891-974b-bc9a198a8238","parent":"group_e0278e38","data":{"status":"STOPPED","graphLock":false,"guid":"bdd8acb0"},"source":{"cell":"a1d8d2a3-3c96-4862-904e-a874bef76a57","port":"9591d6e0-64ca-4d8c-b42b-29f439ac3e0f"},"target":{"cell":"b5fef33b-ede1-4d8a-888c-2bbfce294b98","port":"88ffbb5b-d26a-42d3-9f91-337e0436d92a"}},{"shape":"dag-edge","attrs":{"line":{"stroke":"#1acccf","strokeWidth":6,"strokeDasharray":""}},"zIndex":0,"id":"3b4fd793-123a-440d-ac6a-507e687acfb0","parent":"group_490b7b77","data":{"status":"STOPPED","graphLock":false,"guid":"c746c605"},"source":{"cell":"c98381bf-8e21-443b-b241-ee8a07d11b7b","port":"7961fb07-7eec-443e-91c5-6a3177732566"},"target":{"cell":"00798d3e-b188-4dec-a9bb-094552db721b","port":"1a2addf1-bd70-47bd-99dd-c436db43a226"}},{"shape":"dag-edge","attrs":{"line":{"stroke":"#1acccf","strokeWidth":6,"strokeDasharray":""}},"zIndex":0,"id":"7fc677de-9e0c-4d08-a895-ce783dfe2928","data":{"status":"STOPPED","graphLock":false,"guid":"68bd30c1"},"parent":"group_490b7b77","source":{"cell":"c98381bf-8e21-443b-b241-ee8a07d11b7b","port":"7961fb07-7eec-443e-91c5-6a3177732566"},"target":{"cell":"56284350-1bc5-465f-b7d4-2c7fbe94097d","port":"7c77e391-3961-4bbb-b009-a347149b449e"}},{"shape":"dag-edge","attrs":{"line":{"stroke":"#165b5c","strokeWidth":6,"strokeDasharray":""}},"zIndex":0,"id":"b935179d-0abb-4141-9eee-313fe6d07003","data":{"status":"STOPPED","graphLock":false,"guid":"c285aaf4"},"parent":"group_490b7b77","source":{"cell":"c98381bf-8e21-443b-b241-ee8a07d11b7b","port":"51510414-8a0c-49f6-a6b0-3eec528bed65"},"target":{"cell":"56284350-1bc5-465f-b7d4-2c7fbe94097d","port":"c74b7ffb-9cab-4583-92ec-9700ce552318"}},{"shape":"dag-edge","attrs":{"line":{"stroke":"#1acccf","strokeWidth":6,"strokeDasharray":""}},"zIndex":0,"id":"da5b3fdd-f8da-4b6a-9e21-bbbbe388d722","data":{"status":"STOPPED","graphLock":false,"guid":"c002a448"},"parent":"group_490b7b77","source":{"cell":"c98381bf-8e21-443b-b241-ee8a07d11b7b","port":"7961fb07-7eec-443e-91c5-6a3177732566"},"target":{"cell":"1f90147b-c49c-4884-803f-1c97f9824655","port":"32f85b78-82b7-4bd8-b2c9-43a3a5a7903f"}},{"shape":"dag-edge","attrs":{"line":{"stroke":"#165b5c","strokeWidth":6,"strokeDasharray":""}},"zIndex":0,"id":"1bd00053-dd11-43d7-bb29-be47cbb15b3f","source":{"cell":"3e41e3d3-2ef4-44fc-9771-d352e634dfdf","port":"c2aeed53-807a-49ea-b265-6f0f206064d6"},"target":{"cell":"c98381bf-8e21-443b-b241-ee8a07d11b7b","port":"8c3b5c46-5934-496d-ac5f-d8b1ca403188"}},{"shape":"dag-edge","attrs":{"line":{"stroke":"#7a3f59","strokeWidth":6,"strokeDasharray":""}},"zIndex":0,"id":"957cb389-aa29-42f7-b182-ea918580d9b0","data":{"status":"STOPPED","graphLock":false,"guid":"f303258c"},"parent":"group_490b7b77","source":{"cell":"00798d3e-b188-4dec-a9bb-094552db721b","port":"a7f6b04f-baa7-4a5e-901c-d41889514c80"},"target":{"cell":"8989a55c-1f87-404a-8135-58dab5225829","port":"6015e6e3-466d-4099-ae40-413e5e2b4ee4"}},{"shape":"dag-edge","attrs":{"line":{"stroke":"#1acccf","strokeWidth":6,"strokeDasharray":""}},"zIndex":0,"id":"a367cd6d-29d2-4df9-9e78-b1b05a6286a8","data":{"status":"STOPPED","graphLock":false,"guid":"669c38bd"},"parent":"group_490b7b77","source":{"cell":"00798d3e-b188-4dec-a9bb-094552db721b","port":"ce651fd7-c5f2-4e6b-a719-6f877a53ca65"},"target":{"cell":"45e063e4-8d3e-4e10-a1cd-48be2f78e97a","port":"71cb731c-4648-41d6-933a-946f2a0db521"}},{"shape":"dag-edge","attrs":{"line":{"stroke":"#7a3f59","strokeWidth":6,"strokeDasharray":""}},"zIndex":0,"id":"79727e41-f91a-42af-8610-bf695d1d5bab","data":{"status":"STOPPED","graphLock":false,"guid":"c88e20bc"},"parent":"group_490b7b77","source":{"cell":"00798d3e-b188-4dec-a9bb-094552db721b","port":"a7f6b04f-baa7-4a5e-901c-d41889514c80"},"target":{"cell":"dc4e22e5-a1fe-4d99-9f2b-01367e813b1b","port":"91a87f00-4441-4857-8dae-dfc363367917"}},{"shape":"dag-edge","attrs":{"line":{"stroke":"#1acccf","strokeWidth":6,"strokeDasharray":""}},"zIndex":0,"id":"198f0bee-a079-4393-a218-eff672ec0e45","data":{"status":"STOPPED","graphLock":false,"guid":"14f3b8d0"},"parent":"group_490b7b77","source":{"cell":"1f90147b-c49c-4884-803f-1c97f9824655","port":"3419b89d-70be-479c-9877-75ce3bcfdf98"},"target":{"cell":"00798d3e-b188-4dec-a9bb-094552db721b","port":"0551c2e5-658e-4cb4-ba93-19afc1f138d1"}},{"shape":"dag-edge","attrs":{"line":{"stroke":"#165b5c","strokeWidth":6,"strokeDasharray":""}},"zIndex":0,"id":"b46c8c19-0e51-48a0-8aca-c194b6478543","data":{"status":"STOPPED","graphLock":false,"guid":"fb78dabc"},"parent":"group_490b7b77","source":{"cell":"8989a55c-1f87-404a-8135-58dab5225829","port":"a3a0a2a0-48e1-41c1-93fa-21e92497380f"},"target":{"cell":"b4f890bc-3254-4e03-a4bb-7e16b8d5534d","port":"b6e929c7-606a-477d-9de1-9c5751936aca"}},{"shape":"dag-edge","attrs":{"line":{"stroke":"#165b5c","strokeWidth":6,"strokeDasharray":""}},"zIndex":0,"id":"83b3763e-8da2-4e7e-ae9e-d57b4bc9c113","data":{"status":"STOPPED","graphLock":false,"guid":"e4af8da9"},"parent":"group_490b7b77","source":{"cell":"45e063e4-8d3e-4e10-a1cd-48be2f78e97a","port":"5c66b076-ef20-4c1e-8c41-683c8ba170b2"},"target":{"cell":"dc4e22e5-a1fe-4d99-9f2b-01367e813b1b","port":"2712f986-c147-49dc-8f9a-ffd4a6f07f90"}},{"shape":"dag-edge","attrs":{"line":{"stroke":"#165b5c","strokeWidth":6,"strokeDasharray":""}},"zIndex":0,"id":"4c9746a9-80ec-49af-aeeb-68f273ee6346","source":{"cell":"bbdd935f-f587-4db9-ad66-f32caec4d18b","port":"a0ae4b81-5784-4661-b4d5-400266424ccd"},"target":{"cell":"3e41e3d3-2ef4-44fc-9771-d352e634dfdf","port":"627134a1-328f-4aa2-8125-efef9f5b23ec"}}]},"configList":[{"label":"配置1","value":"826wcjd2","data":[{"name":"ImageStorge","version":"0.0.2","category":"DS","description":"This is a DataStorage plugin","author":"liwen","config":{"module":"DS__A__ImageStorge","executor":"ImageStorge","initParams":{"store_dir":{"name":"store_dir","alias":"存图目录","require":true,"onHidden":true,"default":"/tmp/ubvision","value":"/data/pangu-fs/track-inspect","type":"Dir","description":"选择一个存图目录","widget":{"type":"Dir"}},"target_format":{"name":"target_format","alias":"存图格式","require":true,"default":"jpg","value":".png","type":"List[string]","widget":{"type":"Radio","options":[".jpg",".png",".bmp"]}},"platForm_723b3e19":{"name":"platForm_723b3e19","alias":"platForm_723b3e19","orderId":5,"require":false,"default":"/Users/wilr/Downloads/201656991026_.pic_hd.jpg","localPath":"https://seopic.699pic.com/photo/40015/5662.jpg_wh1200.jpg","value":[{"id":"1673425116332","type":"RECT","props":{"name":"矩形矢量图形","textId":"label-text-id-1673425116332","deleteMarkerId":"label-marker-id-1673425116332","label":"缺陷"},"style":{"opacity":1,"fillStyle":"rgba(255, 0, 0, 0)","lineWidth":1,"strokeStyle":"#F00"},"shape":{"x":331.7559993018706,"y":157.17094700662133,"width":87.26617870328407,"height":45.616411594898494}},{"id":"1673425118679","type":"CIRCLE","props":{"name":"圆形矢量图层","textId":"label-text-id-1673425118679","deleteMarkerId":"label-marker-id-1673425118679","label":"缺陷"},"style":{"opacity":1,"fillStyle":"#9370DB","lineWidth":2,"strokeStyle":"#F00"},"option":{"active":false},"shape":{"cx":531.0798847491444,"cy":130.39609672265917,"r":41.5197036429828}}],"type":"File","description":"标注","widget":{"type":"ImageLabelField","id":"platForm_723b3e19"}}},"input":{"src_img":{"type":"numpy.ndarray","require":true,"alias":"src_img"},"category":{"type":"string","require":false,"alias":"category"},"img_name":{"type":"string","require":false,"alias":"img_name"}},"output":{"status":{"type":"bool","alias":"status123123123qwe"},"category":{"type":"string","alias":"category"},"store_path":{"type":"string","alias":"store_path"}}},"alias":"图片存储器ImgStorge","buildIn":false,"useGpu":false,"id":"45e063e4-8d3e-4e10-a1cd-48be2f78e97a","_id":"SNF8MEF6cMipAYTE","createdAt":"2022-06-21T10:15:17.282Z","updatedAt":"2022-06-21T10:17:15.705Z","ifShow":true,"customId":"node_d732fd33","ports":{"groups":{"top":{"position":"top","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}},"bottom":{"position":"bottom","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}}},"items":[{"customId":"port_1f452085","group":"top","label":{"direction":"input","name":"src_img","type":"numpy.ndarray","require":true,"alias":"src_img"},"color":"#1acccf","id":"71cb731c-4648-41d6-933a-946f2a0db521"},{"customId":"port_ac4beda0","group":"top","label":{"direction":"input","name":"category","type":"string","require":false,"alias":"category"},"color":"#165b5c","id":"e5d20ecc-b2dc-4d2f-a7b4-bf0ecc1bcaa6"},{"customId":"port_b1ee47eb","group":"top","label":{"direction":"input","name":"img_name","type":"string","require":false,"alias":"img_name"},"color":"#165b5c","id":"e7e1dabe-8ba7-4c39-a787-f0fbbcd4cfba"},{"customId":"port_b86c9517","group":"bottom","label":{"direction":"output","name":"status","type":"bool","alias":"status"},"color":"#7d573a","id":"f409838a-abbb-4f7e-8e14-98432257447a"},{"customId":"port_1a110c28","group":"bottom","label":{"direction":"output","name":"category","type":"string","alias":"category"},"color":"#165b5c","id":"d87d04e9-331f-4334-922d-6c826211a848"},{"customId":"port_508b1d0d","group":"bottom","label":{"direction":"output","name":"store_path","type":"string","alias":"store_path"},"color":"#165b5c","id":"5c66b076-ef20-4c1e-8c41-683c8ba170b2"}]},"position":{"x":1060.0000000000011,"y":2000.0000000000027},"dropDownCheckBox":["result"],"size":{"width":480,"height":370},"parent":"group_490b7b77"},{"name":"ImageStorge.json","version":"0.0.2","category":"DS","description":"This is a DataStorage plugin","author":"liwen","config":{"module":"DS__A__ImageStorge","executor":"ImageStorge","initParams":{"store_dir":{"name":"store_dir","alias":"存图目录","require":true,"onHidden":true,"default":"/tmp/ubvision","value":"/data/simulate/images","type":"Dir","description":"选择一个存图目录","widget":{"type":"Dir"}},"target_format":{"name":"target_format","alias":"存图格式","require":true,"default":"jpg","value":".jpg","type":"List[string]","widget":{"type":"Radio","options":[".jpg",".png",".bmp"]}}},"input":{"src_img":{"type":"numpy.ndarray","require":true,"alias":"src_img"},"category":{"type":"string","require":false,"alias":"category"},"img_name":{"type":"string","require":false,"alias":"img_name"}},"output":{"status":{"type":"bool","alias":"status"},"category":{"type":"string","alias":"category"},"store_path":{"type":"string","alias":"store_path"}},"group":[]},"alias":"图片存储器ImgStorge.json","buildIn":false,"useGpu":false,"id":"56284350-1bc5-465f-b7d4-2c7fbe94097d","_id":"SNF8MEF6cMipAYTE","createdAt":"2022-06-21T10:15:17.282Z","updatedAt":"2022-07-13T11:02:57.716Z","ifShow":true,"customId":"node_5f987d1b","ports":{"groups":{"top":{"position":"top","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}},"bottom":{"position":"bottom","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}}},"items":[{"customId":"port_b3a9431b","group":"top","label":{"direction":"input","name":"src_img","type":"numpy.ndarray","require":true,"alias":"src_img"},"color":"#1acccf","id":"7c77e391-3961-4bbb-b009-a347149b449e"},{"customId":"port_264baf3a","group":"top","label":{"direction":"input","name":"category","type":"string","require":false,"alias":"category"},"color":"#165b5c","id":"c74b7ffb-9cab-4583-92ec-9700ce552318"},{"customId":"port_0ddb2da7","group":"top","label":{"direction":"input","name":"img_name","type":"string","require":false,"alias":"img_name"},"color":"#165b5c","id":"9c65211b-8867-4cb5-8f39-8a21cee512ce"},{"customId":"port_4f452295","group":"bottom","label":{"direction":"output","name":"status","type":"bool","alias":"status"},"color":"#7d573a","id":"5bdac4c1-3403-47c9-b7a4-7e5fb789559b"},{"customId":"port_a20d197c","group":"bottom","label":{"direction":"output","name":"category","type":"string","alias":"category"},"color":"#165b5c","id":"28eae3a6-f1d8-4e16-88c9-6e385cac052f"},{"customId":"port_854a6544","group":"bottom","label":{"direction":"output","name":"store_path","type":"string","alias":"store_path"},"color":"#165b5c","id":"14306f65-e705-4ca7-8769-cc093726a35c"}]},"position":{"x":830.0000000000011,"y":1370.0000000000027},"size":{"width":444,"height":130},"dropDownCheckBox":["result"],"parent":"group_490b7b77"},{"name":"Responser.json","version":"0.0.1","category":"COMM","description":"This is COMM Responser","author":"lw-Sany","repository":"https://github.com/UBV/ResultParser","bugs":"https://github.com/UBV/ResultParser/issues","config":{"module":"COMM__A__Responser","executor":"Responser","initParams":{"respond_to":{"name":"respond_to","alias":"respond_to","require":false,"type":"string","widget":{"type":"Input"},"value":"1fbf97c8-d887-43a5-8f2c-ed198e098b8b"}},"input":{"response":{"type":"string","require":true,"alias":"response"}},"output":{}},"alias":"TCP-Responser.json","buildIn":false,"useGpu":false,"codeEditor":false,"id":"b4f890bc-3254-4e03-a4bb-7e16b8d5534d","_id":"IIPdi27QjBzC76Ag","createdAt":"2022-06-05T15:14:02.102Z","updatedAt":"2022-07-13T11:03:30.387Z","ifShow":true,"customId":"node_bf76a6ee","ports":{"groups":{"top":{"position":"top","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}},"bottom":{"position":"bottom","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}}},"items":[{"customId":"port_7987924e","group":"top","label":{"direction":"input","name":"response","type":"string","require":true,"alias":"response"},"color":"#165b5c","id":"b6e929c7-606a-477d-9de1-9c5751936aca"}]},"position":{"x":540.0000000000011,"y":2280.0000000000027},"size":{"width":300,"height":130},"dropDownCheckBox":[],"parent":"group_490b7b77"},{"name":"Glue_Trigger_Parser","version":"1.0.0","category":"TOOL","description":"TOOL__C__Glue_Trigger_Parser","author":"sf-Sany","config":{"module":"TOOL__C__Glue_Trigger_Parser","executor":"parse","initParams":{},"input":{"origin_str":{"type":"string","require":true,"alias":"origin_str"}},"output":{"camera":{"type":"string","alias":"camera"},"heart":{"type":"string","alias":"heart"}},"group":[]},"updatedAt":"2022-07-13T13:14:32.108Z","id":"3e41e3d3-2ef4-44fc-9771-d352e634dfdf","_id":"cONUuPsSLoL8Rx5F","createdAt":"2022-07-13T13:14:24.753Z","alias":"Glue_Trigger_Parser","buildIn":false,"useGpu":false,"ifShow":true,"customId":"node_d2946b47","ports":{"groups":{"top":{"position":"top","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}},"bottom":{"position":"bottom","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}}},"items":[{"customId":"port_57fac917","group":"top","label":{"direction":"input","name":"origin_str","type":"string","require":true,"alias":"origin_str"},"color":"#165b5c","id":"627134a1-328f-4aa2-8125-efef9f5b23ec"},{"customId":"port_b8f22edb","group":"bottom","label":{"direction":"output","name":"camera","type":"string","alias":"camera"},"color":"#165b5c","id":"c2aeed53-807a-49ea-b265-6f0f206064d6"},{"customId":"port_0c5a998c","group":"bottom","label":{"direction":"output","name":"heart","type":"string","alias":"heart"},"color":"#165b5c","id":"8852db72-a768-43d3-b57d-be7443a0202b"}]},"position":{"x":1380,"y":650.0000000000003},"size":{"width":300,"height":130},"dropDownCheckBox":[],"parent":"group_6a56067b"},{"alias":"AIEngine","name":"AIEngine","description":"This is an ai engine plugin for industrial visual quality inspection\n2022.7.1","version":"0.1.0","buildIn":false,"useGpu":true,"category":"CV","config":{"module":"CV__B__AIEngine","executor":"AIEngine","initParams":{"config_path":{"name":"config_path","alias":"config_path","require":false,"type":"File","widget":{"type":"File","suffix":[".jpg/.jpeg",".png",".svg",".pdf",".pt",".py",".doc/.docx",".csv",".bmp",".json","all"]},"value":"/opt/ubvision/tujiao/resources/configs/seg_swin_transformer_st_tujiao.json"},"model_path":{"name":"model_path","alias":"model_path","require":false,"type":"File","widget":{"type":"File","suffix":[".jpg/.jpeg",".png",".svg",".pdf",".pt",".py",".doc/.docx",".csv",".bmp",".json","all"]},"value":"/opt/ubvision/tujiao/resources/models/iter_44000_w1024xh1024_sim_fp32.engine"}},"input":{"srcImg":{"type":"numpy.ndarray","require":true,"alias":"srcImg"}},"output":{"class_name":{"type":"list","alias":"class_name"},"masks":{"type":"numpy.ndarray","alias":"masks"},"shapes":{"type":"dict","alias":"shapes"},"status":{"type":"bool","alias":"status"}},"group":[]},"author":"zwt-Sany","repository":"https://github.com/QIVG/AlgorithmPluginDemo","bugs":"https://github.com/QIVG/AlgorithmPluginDemo/issues","_id":"Ug3bhG8x9kYJHpGM","createdAt":"2022-06-17T13:08:34.434Z","updatedAt":"2022-07-14T18:56:31.404Z","id":"1f90147b-c49c-4884-803f-1c97f9824655","ifShow":true,"customId":"node_84079990","ports":{"groups":{"top":{"position":"top","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}},"bottom":{"position":"bottom","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}}},"items":[{"customId":"port_c79f6953","group":"top","label":{"direction":"input","name":"srcImg","type":"numpy.ndarray","require":true,"alias":"srcImg"},"color":"#1acccf","id":"32f85b78-82b7-4bd8-b2c9-43a3a5a7903f"},{"customId":"port_e9d93c82","group":"bottom","label":{"direction":"output","name":"class_name","type":"list","alias":"class_name"},"color":"#694256","id":"ffde9a57-9e5b-43a2-aeef-47e4f0fb0c8e"},{"customId":"port_5d4da216","group":"bottom","label":{"direction":"output","name":"masks","type":"numpy.ndarray","alias":"masks"},"color":"#1acccf","id":"3419b89d-70be-479c-9877-75ce3bcfdf98"},{"customId":"port_7d268669","group":"bottom","label":{"direction":"output","name":"shapes","type":"dict","alias":"shapes"},"color":"#425e7e","id":"a9186b9f-850a-4a0b-8eb2-aa9ad5ee9c6d"},{"customId":"port_369b74fd","group":"bottom","label":{"direction":"output","name":"status","type":"bool","alias":"status"},"color":"#7d573a","id":"d6bdeada-adea-41de-8f90-426e5c945318"}]},"position":{"x":1380.0000000000011,"y":1350.0000000000027},"size":{"width":592,"height":130},"dropDownCheckBox":[],"parent":"group_490b7b77"},{"alias":"GalaxyCamera","name":"GalaxyCamera","description":"GalaxyCamera","version":"0.1.0","buildIn":false,"useGpu":false,"category":"CAPTURE","config":{"module":"CAPTURE__B__GalaxyCamera","executor":"Camera","initParams":{"camera_name":{"name":"camera_name","alias":"camera_name","require":false,"default":"DefaultCam","value":"DefaultCam","type":"string","widget":{"type":"Input"}},"serial_number":{"name":"serial_number","alias":"serial_number","require":true,"default":" ","value":"LT0210051918","type":"string","widget":{"type":"Input"}},"exposure_time":{"name":"exposure_time","alias":"exposure_time","require":true,"default":5000,"value":1500,"type":"int","widget":{"type":"InputNumber","max":100000,"min":500,"step":100,"precision":0}},"data_format":{"name":"data_format","alias":"data_format","require":false,"default":"RGB","value":"RGB","type":"List[string]","widget":{"type":"Radio","options":["RGB","GRAY","RAW"]}},"interval_time":{"name":"interval_time","alias":"interval_time","require":true,"default":0,"type":"float","widget":{"type":"InputNumber","max":5,"min":0,"step":0.05,"precision":2},"value":0.1},"width":{"type":"float","default":2048,"require":false,"widget":{"type":"InputNumber","max":6000,"min":100,"step":1,"precision":1},"value":5496,"alias":"width","name":"width"},"height":{"type":"float","default":2048,"require":false,"widget":{"type":"InputNumber","max":6000,"min":100,"step":1,"precision":1},"value":3672,"alias":"height","name":"height"},"DEV_MAPPER":{"type":"str","default":"/dev/bus/usb","value":"/dev/bus/usb","require":true,"widget":{"type":"Input"},"alias":"DEV_MAPPER","name":"DEV_MAPPER"},"NETWORKMODE":{"default":"host","require":true,"value":"host","type":"List[string]","widget":{"type":"Radio","options":["host","bridge"]},"alias":"NETWORKMODE","name":"NETWORKMODE"},"Gain":{"name":"Gain","alias":"Gain","require":true,"default":10,"value":10,"type":"float","widget":{"type":"Slider","max":20,"min":0.1,"step":0.1}}},"input":{"signal":{"type":"string","require":true,"alias":"signal"}},"output":{"frame":{"type":"numpy.ndarray","alias":"frame"},"category":{"type":"string","alias":"category"},"status":{"type":"bool","alias":"status"}},"group":[{"id":"76a2eea9","open":false,"children":["NETWORKMODE","DEV_MAPPER"],"name":"Advanced Options"}]},"author":"liwen","_id":"UEpwqYTvke6un0Rs","createdAt":"2022-07-10T03:06:07.682Z","updatedAt":"2022-07-15T07:45:51.867Z","id":"c98381bf-8e21-443b-b241-ee8a07d11b7b","ifShow":true,"customId":"node_0bb7ada6","ports":{"groups":{"top":{"position":"top","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}},"bottom":{"position":"bottom","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}}},"items":[{"customId":"port_b776d46c","group":"top","label":{"direction":"input","name":"signal","type":"string","require":true,"alias":"signal"},"color":"#165b5c","id":"8c3b5c46-5934-496d-ac5f-d8b1ca403188"},{"customId":"port_42c40766","group":"bottom","label":{"direction":"output","name":"frame","type":"numpy.ndarray","alias":"frame"},"color":"#1acccf","id":"7961fb07-7eec-443e-91c5-6a3177732566"},{"customId":"port_a7b8fbcc","group":"bottom","label":{"direction":"output","name":"category","type":"string","alias":"category"},"color":"#165b5c","id":"51510414-8a0c-49f6-a6b0-3eec528bed65"},{"customId":"port_ddc16065","group":"bottom","label":{"direction":"output","name":"status","type":"bool","alias":"status"},"color":"#7d573a","id":"7837188d-ec7e-440a-b1d1-396334560acf"}]},"position":{"x":810.0000000000011,"y":1060.0000000000027},"size":{"width":444,"height":130},"dropDownCheckBox":[],"parent":"group_490b7b77"},{"alias":"服务TCPServer","name":"TcpServer","description":"TCP服务插件，跟监听指定端口的请求，并根据\"默认异常响应信息\"和 \"异常中断响应表\" 进行响应","version":"0.0.2","buildIn":false,"useGpu":false,"category":"SERV","config":{"module":"SERV__A__TcpServer","executor":"TcpServer","initParams":{"port":{"name":"port","alias":"port","require":true,"default":2000,"value":5546,"type":"int","description":"监听端口","widget":{"type":"InputNumber","max":65535,"min":1000,"step":1,"precision":0}},"default_res_msg":{"name":"default_res_msg","alias":"默认异常响应信息","require":true,"default":"ERROR","value":"ERROR","type":"string","description":"默认异常响应信息","widget":{"type":"Input"}},"response_template":{"name":"response_template","alias":"异常中断响应表","require":false,"default":"{}","type":"string","widget":{"type":"codeEditor"},"value":"{}"}},"input":{},"output":{"message":{"type":"string","alias":"message"}},"group":[]},"author":"liwen","repository":"https://github.com/UBV/TcpServer","bugs":"https://github.com/UBV/TcpServer/issues","id":"a1d8d2a3-3c96-4862-904e-a874bef76a57","_id":"1DBwzaY2tR0lAQ2J","createdAt":"2022-06-21T10:16:06.395Z","updatedAt":"2022-07-14T18:56:31.402Z","ifShow":true,"customId":"node_72eca6e4","ports":{"groups":{"top":{"position":"top","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}},"bottom":{"position":"bottom","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}}},"items":[{"customId":"port_82c0c610","group":"bottom","label":{"direction":"output","name":"message","type":"string","alias":"message"},"color":"#165b5c","id":"9591d6e0-64ca-4d8c-b42b-29f439ac3e0f"}]},"position":{"x":-240,"y":1160},"size":{"width":300,"height":130},"dropDownCheckBox":[],"parent":"group_e0278e38"},{"alias":"Glue_Trigger_Parser","name":"Glue_Trigger_Parser","description":"TOOL__C__Glue_Trigger_Parser","version":"1.0.0","buildIn":false,"useGpu":false,"category":"TOOL","config":{"module":"TOOL__C__Glue_Trigger_Parser","executor":"parse","initParams":{},"input":{"origin_str":{"type":"string","require":true,"alias":"origin_str"}},"output":{"camera":{"type":"string","alias":"camera"},"heart":{"type":"string","alias":"heart"}},"group":[]},"author":"sf-Sany","updatedAt":"2022-07-19T11:58:18.297Z","id":"b5fef33b-ede1-4d8a-888c-2bbfce294b98","_id":"ywHaV9aVLeaakgcn","createdAt":"2022-07-19T11:57:49.555Z","ifShow":true,"customId":"node_1f183bca","ports":{"groups":{"top":{"position":"top","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}},"bottom":{"position":"bottom","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}}},"items":[{"customId":"port_ec6ea7e6","group":"top","label":{"direction":"input","name":"origin_str","type":"string","require":true,"alias":"origin_str"},"color":"#165b5c","id":"88ffbb5b-d26a-42d3-9f91-337e0436d92a"},{"customId":"port_90b1f6d0","group":"bottom","label":{"direction":"output","name":"camera","type":"string","alias":"camera"},"color":"#165b5c","id":"fbcc3c56-0d77-4a49-adf0-2dbf14f03400"},{"customId":"port_4a8425fd","group":"bottom","label":{"direction":"output","name":"heart","type":"string","alias":"heart"},"color":"#165b5c","id":"058e4bdb-167e-48f4-9188-3273baff14e4"}]},"position":{"x":-250,"y":1600},"size":{"width":300,"height":130},"dropDownCheckBox":[],"parent":"group_e0278e38"},{"alias":"TCP-Responser","name":"Responser","description":"This is COMM Responser","version":"0.0.1","buildIn":false,"useGpu":false,"category":"COMM","config":{"module":"COMM__A__Responser","executor":"Responser","initParams":{"respond_to":{"name":"respond_to","alias":"respond_to","require":false,"type":"string","widget":{"type":"Input"},"value":"a1d8d2a3-3c96-4862-904e-a874bef76a57"}},"input":{"response":{"type":"string","require":true,"alias":"response"}},"output":{}},"author":"lw-Sany","repository":"https://github.com/UBV/ResultParser","bugs":"https://github.com/UBV/ResultParser/issues","codeEditor":false,"id":"b78ac9ce-d8f4-4e76-84eb-f38cf12a992a","_id":"IIPdi27QjBzC76Ag","createdAt":"2022-06-05T15:14:02.102Z","updatedAt":"2022-07-14T18:56:31.401Z","ifShow":true,"customId":"node_8a9c1478","ports":{"groups":{"top":{"position":"top","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}},"bottom":{"position":"bottom","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}}},"items":[{"customId":"port_59b0c7f5","group":"top","label":{"direction":"input","name":"response","type":"string","require":true,"alias":"response"},"color":"#165b5c","id":"b97034ff-227c-4f7f-bb0d-8ad3248ba819"}]},"position":{"x":-240,"y":2050},"size":{"width":300,"height":130},"dropDownCheckBox":[],"parent":"group_e0278e38"},{"alias":"DataServer","name":"DataServer","description":"This is a DataServer plugin","version":"0.0.1","buildIn":false,"useGpu":false,"category":"TOOL","config":{"module":"TOOL__C__DataServer","executor":"DataServer","initParams":{},"input":{"status":{"type":"int","require":true,"alias":"status"},"show_img_path":{"type":"string","require":false,"alias":"show_img_path"}},"output":{},"group":[]},"author":"liwen","updatedAt":"2022-07-21T04:56:06.372Z","_id":"bf1BpfxQGLUzkw2c","createdAt":"2022-07-14T01:21:14.656Z","id":"dc4e22e5-a1fe-4d99-9f2b-01367e813b1b","ifShow":true,"customId":"node_45487823","ports":{"groups":{"top":{"position":"top","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}},"bottom":{"position":"bottom","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}}},"items":[{"customId":"port_efc2214c","group":"top","label":{"direction":"input","name":"status","type":"int","require":true,"alias":"status"},"color":"#7a3f59","id":"91a87f00-4441-4857-8dae-dfc363367917"},{"customId":"port_25177c19","group":"top","label":{"direction":"input","name":"show_img_path","type":"string","require":false,"alias":"show_img_path"},"color":"#165b5c","id":"2712f986-c147-49dc-8f9a-ffd4a6f07f90"}]},"position":{"x":850.0000000000011,"y":2590.0000000000027},"size":{"width":300,"height":130},"dropDownCheckBox":[],"parent":"group_490b7b77"},{"alias":"Glue_Responser_Parser","name":"Glue_Responser_Parser","description":"TOOL__C__Glue_Responser_Parser","version":"1.0.0","buildIn":false,"useGpu":false,"category":"TOOL","config":{"module":"TOOL__C__Glue_Responser_Parser","executor":"parse","initParams":{},"input":{"status":{"type":"int","require":true,"alias":"status"}},"output":{"message":{"type":"string","alias":"message"}},"group":[]},"author":"sf-Sany","updatedAt":"2022-07-21T05:03:56.951Z","id":"8989a55c-1f87-404a-8135-58dab5225829","_id":"FfSVdxh6bFjrCZKe","createdAt":"2022-07-21T05:03:51.617Z","ifShow":true,"customId":"node_86392e2f","ports":{"groups":{"top":{"position":"top","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}},"bottom":{"position":"bottom","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}}},"items":[{"customId":"port_a1e0e149","group":"top","label":{"direction":"input","name":"status","type":"int","require":true,"alias":"status"},"color":"#7a3f59","id":"6015e6e3-466d-4099-ae40-413e5e2b4ee4"},{"customId":"port_d5ae06df","group":"bottom","label":{"direction":"output","name":"message","type":"string","alias":"message"},"color":"#165b5c","id":"a3a0a2a0-48e1-41c1-93fa-21e92497380f"}]},"position":{"x":550.0000000000011,"y":1990.0000000000027},"size":{"width":300,"height":130},"dropDownCheckBox":[],"parent":"group_490b7b77"},{"alias":"Business_Glue_Station","name":"Business_Glue_Station","description":"This is a business  plugin for Glue station","version":"0.0.1","buildIn":false,"useGpu":false,"category":"CV","config":{"module":"CV__C__Business_Glue_Station","executor":"Business_Glue_Station","initParams":{"glue_width_max":{"name":"glue_width_max","alias":"glue_width_max","require":false,"value":80,"type":"int","widget":{"type":"InputNumber","max":300,"min":0,"step":1,"precision":0}},"glue_width_min":{"name":"glue_width_min","alias":"glue_width_min","require":false,"value":1,"type":"int","widget":{"type":"InputNumber","max":300,"min":0,"step":1,"precision":0}}},"input":{"srcImg":{"type":"numpy.ndarray","require":true,"alias":"srcImg"},"maskImg":{"type":"numpy.ndarray","require":true,"alias":"maskImg"}},"output":{"status":{"type":"int","alias":"status"},"showImg":{"type":"numpy.ndarray","alias":"showImg"}},"group":[]},"author":"Sany-ShenFei","updatedAt":"2022-07-21T05:10:19.588Z","id":"00798d3e-b188-4dec-a9bb-094552db721b","_id":"rwz6WHooi52rSoQo","createdAt":"2022-07-21T05:00:31.271Z","ifShow":true,"customId":"node_90cc8e9d","ports":{"groups":{"top":{"position":"top","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}},"bottom":{"position":"bottom","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}}},"items":[{"customId":"port_491f4c24","group":"top","label":{"direction":"input","name":"srcImg","type":"numpy.ndarray","require":true,"alias":"srcImg"},"color":"#1acccf","id":"1a2addf1-bd70-47bd-99dd-c436db43a226"},{"customId":"port_c8b102bf","group":"top","label":{"direction":"input","name":"maskImg","type":"numpy.ndarray","require":true,"alias":"maskImg"},"color":"#1acccf","id":"0551c2e5-658e-4cb4-ba93-19afc1f138d1"},{"customId":"port_e1b3adac","group":"bottom","label":{"direction":"output","name":"status","type":"int","alias":"status"},"color":"#7a3f59","id":"a7f6b04f-baa7-4a5e-901c-d41889514c80"},{"customId":"port_d4718e1c","group":"bottom","label":{"direction":"output","name":"showImg","type":"numpy.ndarray","alias":"showImg"},"color":"#1acccf","id":"ce651fd7-c5f2-4e6b-a719-6f877a53ca65"}]},"position":{"x":880.0000000000011,"y":1690.0000000000027},"size":{"width":300,"height":130},"dropDownCheckBox":[],"parent":"group_490b7b77"},{"alias":"服务TCPServer","name":"TcpServer","description":"TCP服务插件，跟监听指定端口的请求，并根据\"默认异常响应信息\"和 \"异常中断响应表\" 进行响应","version":"0.0.2","buildIn":false,"useGpu":false,"category":"SERV","config":{"module":"SERV__A__TcpServer","executor":"TcpServer","initParams":{"port":{"name":"port","alias":"port","require":true,"default":2000,"value":5547,"type":"int","description":"监听端口","widget":{"type":"InputNumber","max":65535,"min":1000,"step":1,"precision":0}},"default_res_msg":{"name":"default_res_msg","alias":"默认异常响应信息","require":true,"default":"ERROR","value":"ERROR","type":"string","description":"默认异常响应信息","widget":{"type":"Input"}},"response_template":{"name":"response_template","alias":"异常中断响应表","require":false,"default":"{}","type":"string","widget":{"type":"codeEditor"},"value":"{}"}},"input":{},"output":{"message":{"type":"string","alias":"message"}},"group":[]},"author":"liwen","repository":"https://github.com/UBV/TcpServer","bugs":"https://github.com/UBV/TcpServer/issues","id":"bbdd935f-f587-4db9-ad66-f32caec4d18b","_id":"1DBwzaY2tR0lAQ2J","createdAt":"2022-06-21T10:16:06.395Z","updatedAt":"2022-07-14T18:56:31.402Z","ifShow":true,"customId":"node_45ed4f5c","ports":{"groups":{"top":{"position":"top","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}},"bottom":{"position":"bottom","attrs":{"fo":{"r":6,"magnet":true,"strokeWidth":1,"fill":"#fff"}}}},"items":[{"customId":"port_688d2b5c","group":"bottom","label":{"direction":"output","name":"message","type":"string","alias":"message"},"color":"#165b5c","id":"a0ae4b81-5784-4661-b4d5-400266424ccd"}]},"position":{"x":600,"y":640},"dropDownCheckBox":[],"size":{"width":300,"height":130}}],"listType":"block"}],"commonInfo":{"productionInfo":"涂布机正极","stationInfo":"工位1A面","useInfo":"尺寸测量与缺陷检测"},"contentData":{"home":[{"i":"header","x":0,"y":0,"w":0,"h":0,"minW":0,"maxW":100,"minH":0,"maxH":100},{"i":"slider-1","x":0,"y":0,"w":9,"h":10,"minW":1,"maxW":100,"minH":2,"maxH":100},{"i":"slider-4","x":9,"y":0,"w":87,"h":2,"minW":1,"maxW":100,"minH":2,"maxH":100},{"i":"footer-1","x":2,"y":14,"w":0,"h":0,"minW":0,"maxW":100,"minH":0,"maxH":100},{"i":"footer-2","x":0,"y":32,"w":9,"h":12,"minW":1,"maxW":100,"minH":2,"maxH":100}],"content":[{"id":"45e063e4-8e3e-4e10-a1cd-48be6g78e97a$$imgContrast","value":["45e063e4-8e3e-4e10-a1cd-48be6g78e97a"],"size":{"i":"45e063e4-8e3e-4e10-a1cd-48be6g78e97a$$imgContrast","x":20,"y":2,"w":48,"h":20,"minW":1,"maxW":100,"minH":2,"maxH":100},"type":"imgContrast","tab":"1","fontSize":24,"backgroundColor":"border","ifLocalStorage":true,"CCDName":"缺陷过滤","comparison":false,"interlacing":false,"modelRotate":false,"modelScale":false,"modelRotateScreenshot":false,"password":"","passwordHelp":"","ifShowHeader":false,"ifShowColorList":false,"headerBackgroundColor":"default","markNumber":false,"titlePaddingSize":8,"bodyPaddingSize":0,"titleBackgroundColor":"transparent","titleFontSize":24},{"id":"45e063e4-8e3e-4e10-a1cd-48be6g78e97a$$segmentSwitch","value":["45e063e4-8e3e-4e10-a1cd-48be6g78e97a"],"size":{"i":"45e063e4-8e3e-4e10-a1cd-48be6g78e97a$$segmentSwitch","x":27,"y":23,"w":38,"h":4,"minW":1,"maxW":100,"minH":2,"maxH":100},"type":"segmentSwitch","tab":"1","yName":"开关按钮","xName":"123/qwe","fontSize":24,"fetchType":"post","backgroundColor":"default","des_bordered":false,"des_layout":"horizontal","ifLocalStorage":true,"comparison":false,"interlacing":false,"modelRotate":false,"modelScale":false,"modelRotateScreenshot":false,"password":"","passwordHelp":"","ifShowHeader":false,"ifShowColorList":false,"headerBackgroundColor":"default","markNumber":false,"titlePaddingSize":0,"bodyPaddingSize":0,"titleBackgroundColor":"transparent","titleFontSize":20,"timeSelectDefault":[{"label":"自由模式","value":"01"},{"label":"一键OK","value":"qwe"},{"label":"一键NG","value":"asd"}]}],"footerSelectList":["45e063e4-8d3e-4e10-a1cd-48be2f78e97a"],"theme":"dark","ipList":[],"inIframe":false,"contentHeader":{"slider-1":false,"slider-2":true,"slider-3":true,"slider-4":false,"footer-1":true,"footer-2":true,"45e063e4-8e3e-4e10-a1cd-48be6g78e97a$$$$img":true},"autoSize":true,"contentSize":{"width":1600,"height":900},"gridMargin":8,"pageIconPosition":{},"homeSetting":{"footer-1":{"fontSize":14},"footer-2":{"fontSize":20},"header":{"fontSize":20,"headerTitleFontSize":24}}},"environment":{"serviceIp":"localhost","servicePort":"18080"},"project_id":"9560c0ea"}
  });
};

const getFlowStatusService = (req: Request, res: Response) => {
  res.json({
    code: 'SUCCESS',
    msg: '',
    data: {},
  });
};

const getListStatusService = (req: Request, res: Response) => {
  res.json({
    code: 'SUCCESS',
    msg: '',
    data: {
      e1fec01: { '123123123123123': 'running' },
    },
  });
};

export default {
  'GET /projects': getProjectsList,
  'GET /project/*': getParams,
  'GET /task/*': getFlowStatusService,
  'GET /tasks': getListStatusService,
};
