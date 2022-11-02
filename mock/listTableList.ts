import { Request, Response } from 'express';

const getParams = (req: Request, res: Response) => {
  res.json({
    data: {
      "name": "FDX_GLUE_正式",
      "description": "分动箱涂胶",
      "plugin_path": "/opt/ubvision/tujiao/plugins",
      "zoom": 0.4200913242009132,
      "graphLock": false,
      "position": {
        "x": 967.2173913043479,
        "y": -609.9999999999999
      },
      "flowData": {
        "groups": [{
          "position": {
            "x": 310,
            "y": 580
          },
          "size": {
            "width": 1720,
            "height": 280
          },
          "attrs": {
            "body": {
              "fill": "#2E394D"
            },
            "buttonSign": {
              "d": "M 2 5 8 5"
            },
            "label": {
              "text": "group_6a56067b"
            }
          },
          "id": "group_6a56067b",
          "shape": "dag-group",
          "customId": "group_6a56067b",
          "childrenList": ["3e41e3d3-2ef4-44fc-9771-d352e634dfdf"],
          "zIndex": 0,
          "children": ["3e41e3d3-2ef4-44fc-9771-d352e634dfdf"],
          "originPosition": {
            "x": 310,
            "y": 580
          },
          "originSize": {
            "width": 1720,
            "height": 280
          }
        }, {
          "position": {
            "x": -340,
            "y": 1100
          },
          "size": {
            "width": 440,
            "height": 1120
          },
          "attrs": {
            "body": {
              "fill": "#2E394D"
            },
            "buttonSign": {
              "d": "M 2 5 8 5"
            },
            "label": {
              "text": "group_e0278e38"
            }
          },
          "id": "group_e0278e38",
          "shape": "dag-group",
          "customId": "group_e0278e38",
          "childrenList": ["b78ac9ce-d8f4-4e76-84eb-f38cf12a992a", "a1d8d2a3-3c96-4862-904e-a874bef76a57", "b5fef33b-ede1-4d8a-888c-2bbfce294b98"],
          "zIndex": 0,
          "children": ["b78ac9ce-d8f4-4e76-84eb-f38cf12a992a", "a1d8d2a3-3c96-4862-904e-a874bef76a57", "b5fef33b-ede1-4d8a-888c-2bbfce294b98"],
          "originPosition": {
            "x": -340,
            "y": 1100
          },
          "originSize": {
            "width": 440,
            "height": 1100
          }
        }, {
          "position": {
            "x": 320,
            "y": 1020
          },
          "size": {
            "width": 1770,
            "height": 1810
          },
          "attrs": {
            "body": {
              "fill": "#2E394D"
            },
            "buttonSign": {
              "d": "M 2 5 8 5"
            },
            "label": {
              "text": "group_490b7b77"
            }
          },
          "id": "group_490b7b77",
          "shape": "dag-group",
          "customId": "group_490b7b77",
          "childrenList": ["c98381bf-8e21-443b-b241-ee8a07d11b7b", "00798d3e-b188-4dec-a9bb-094552db721b", "8989a55c-1f87-404a-8135-58dab5225829", "b4f890bc-3254-4e03-a4bb-7e16b8d5534d", "45e063e4-8d3e-4e10-a1cd-48be2f78e97a", "56284350-1bc5-465f-b7d4-2c7fbe94097d", "1f90147b-c49c-4884-803f-1c97f9824655", "dc4e22e5-a1fe-4d99-9f2b-01367e813b1b"],
          "zIndex": 0,
          "children": ["c98381bf-8e21-443b-b241-ee8a07d11b7b", "00798d3e-b188-4dec-a9bb-094552db721b", "8989a55c-1f87-404a-8135-58dab5225829", "b4f890bc-3254-4e03-a4bb-7e16b8d5534d", "45e063e4-8d3e-4e10-a1cd-48be2f78e97a", "56284350-1bc5-465f-b7d4-2c7fbe94097d", "1f90147b-c49c-4884-803f-1c97f9824655", "dc4e22e5-a1fe-4d99-9f2b-01367e813b1b"],
          "originPosition": {
            "x": 320,
            "y": 1020
          },
          "originSize": {
            "width": 1770,
            "height": 1810
          }
        }],
        "nodes": [{
          "name": "ImageStorge",
          "version": "0.0.2",
          "category": "DS",
          "description": "This is a DataStorage plugin",
          "author": "liwen",
          "config": {
            "module": "DS__A__ImageStorge",
            "executor": "ImageStorge",
            "initParams": {
              "store_dir": {
                "name": "store_dir",
                "alias": "存图目录",
                "require": true,
                "onHidden": true,
                "default": "/tmp/ubvision",
                "value": "/data/pangu-fs/track-inspect",
                "type": "Dir",
                "description": "选择一个存图目录",
                "widget": {
                  "type": "Dir"
                }
              },
              "target_format": {
                "name": "target_format",
                "alias": "存图格式",
                "require": true,
                "default": "jpg",
                "value": ".jpg",
                "type": "List[string]",
                "widget": {
                  "type": "Radio",
                  "options": [".jpg", ".png", ".bmp"]
                }
              }
            },
            "input": {
              "src_img": {
                "type": "numpy.ndarray",
                "require": true,
                "alias": "src_img"
              },
              "category": {
                "type": "string",
                "require": false,
                "alias": "category"
              },
              "img_name": {
                "type": "string",
                "require": false,
                "alias": "img_name"
              }
            },
            "output": {
              "status": {
                "type": "bool",
                "alias": "status"
              },
              "category": {
                "type": "string",
                "alias": "category"
              },
              "store_path": {
                "type": "string",
                "alias": "store_path"
              }
            }
          },
          "alias": "图片存储器ImgStorge",
          "buildIn": false,
          "useGpu": false,
          "id": "45e063e4-8d3e-4e10-a1cd-48be2f78e97a",
          "_id": "SNF8MEF6cMipAYTE",
          "createdAt": "2022-06-21T10:15:17.282Z",
          "updatedAt": "2022-06-21T10:17:15.705Z",
          "ifShow": true,
          "customId": "node_d732fd33",
          "ports": {
            "groups": {
              "top": {
                "position": "top",
                "attrs": {
                  "fo": {
                    "r": 6,
                    "magnet": true,
                    "strokeWidth": 1,
                    "fill": "#fff"
                  }
                }
              },
              "bottom": {
                "position": "bottom",
                "attrs": {
                  "fo": {
                    "r": 6,
                    "magnet": true,
                    "strokeWidth": 1,
                    "fill": "#fff"
                  }
                }
              }
            },
            "items": [{
              "customId": "port_1f452085",
              "group": "top",
              "label": {
                "direction": "input",
                "name": "src_img",
                "type": "numpy.ndarray",
                "require": true,
                "alias": "src_img"
              },
              "color": "#1acccf",
              "id": "71cb731c-4648-41d6-933a-946f2a0db521"
            }, {
              "customId": "port_ac4beda0",
              "group": "top",
              "label": {
                "direction": "input",
                "name": "category",
                "type": "string",
                "require": false,
                "alias": "category"
              },
              "color": "#165b5c",
              "id": "e5d20ecc-b2dc-4d2f-a7b4-bf0ecc1bcaa6"
            }, {
              "customId": "port_b1ee47eb",
              "group": "top",
              "label": {
                "direction": "input",
                "name": "img_name",
                "type": "string",
                "require": false,
                "alias": "img_name"
              },
              "color": "#165b5c",
              "id": "e7e1dabe-8ba7-4c39-a787-f0fbbcd4cfba"
            }, {
              "customId": "port_b86c9517",
              "group": "bottom",
              "label": {
                "direction": "output",
                "name": "status",
                "type": "bool",
                "alias": "status"
              },
              "color": "#7d573a",
              "id": "f409838a-abbb-4f7e-8e14-98432257447a"
            }, {
              "customId": "port_1a110c28",
              "group": "bottom",
              "label": {
                "direction": "output",
                "name": "category",
                "type": "string",
                "alias": "category"
              },
              "color": "#165b5c",
              "id": "d87d04e9-331f-4334-922d-6c826211a848"
            }, {
              "customId": "port_508b1d0d",
              "group": "bottom",
              "label": {
                "direction": "output",
                "name": "store_path",
                "type": "string",
                "alias": "store_path"
              },
              "color": "#165b5c",
              "id": "5c66b076-ef20-4c1e-8c41-683c8ba170b2"
            }]
          },
          "position": {
            "x": 1060.0000000000011,
            "y": 2000.0000000000027
          },
          "dropDownCheckBox": ["result"],
          "size": {
            "width": 480,
            "height": 370
          },
          "parent": "group_490b7b77"
        }, {
          "name": "ImageStorge.json",
          "version": "0.0.2",
          "category": "DS",
          "description": "This is a DataStorage plugin",
          "author": "liwen",
          "config": {
            "module": "DS__A__ImageStorge",
            "executor": "ImageStorge",
            "initParams": {
              "store_dir": {
                "name": "store_dir",
                "alias": "存图目录",
                "require": true,
                "onHidden": true,
                "default": "/tmp/ubvision",
                "value": "/data/simulate/images",
                "type": "Dir",
                "description": "选择一个存图目录",
                "widget": {
                  "type": "Dir"
                }
              },
              "target_format": {
                "name": "target_format",
                "alias": "存图格式",
                "require": true,
                "default": "jpg",
                "value": ".jpg",
                "type": "List[string]",
                "widget": {
                  "type": "Radio",
                  "options": [".jpg", ".png", ".bmp"]
                }
              }
            },
            "input": {
              "src_img": {
                "type": "numpy.ndarray",
                "require": true,
                "alias": "src_img"
              },
              "category": {
                "type": "string",
                "require": false,
                "alias": "category"
              },
              "img_name": {
                "type": "string",
                "require": false,
                "alias": "img_name"
              }
            },
            "output": {
              "status": {
                "type": "bool",
                "alias": "status"
              },
              "category": {
                "type": "string",
                "alias": "category"
              },
              "store_path": {
                "type": "string",
                "alias": "store_path"
              }
            },
            "group": []
          },
          "alias": "图片存储器ImgStorge.json",
          "buildIn": false,
          "useGpu": false,
          "id": "56284350-1bc5-465f-b7d4-2c7fbe94097d",
          "_id": "SNF8MEF6cMipAYTE",
          "createdAt": "2022-06-21T10:15:17.282Z",
          "updatedAt": "2022-07-13T11:02:57.716Z",
          "ifShow": true,
          "customId": "node_5f987d1b",
          "ports": {
            "groups": {
              "top": {
                "position": "top",
                "attrs": {
                  "fo": {
                    "r": 6,
                    "magnet": true,
                    "strokeWidth": 1,
                    "fill": "#fff"
                  }
                }
              },
              "bottom": {
                "position": "bottom",
                "attrs": {
                  "fo": {
                    "r": 6,
                    "magnet": true,
                    "strokeWidth": 1,
                    "fill": "#fff"
                  }
                }
              }
            },
            "items": [{
              "customId": "port_b3a9431b",
              "group": "top",
              "label": {
                "direction": "input",
                "name": "src_img",
                "type": "numpy.ndarray",
                "require": true,
                "alias": "src_img"
              },
              "color": "#1acccf",
              "id": "7c77e391-3961-4bbb-b009-a347149b449e"
            }, {
              "customId": "port_264baf3a",
              "group": "top",
              "label": {
                "direction": "input",
                "name": "category",
                "type": "string",
                "require": false,
                "alias": "category"
              },
              "color": "#165b5c",
              "id": "c74b7ffb-9cab-4583-92ec-9700ce552318"
            }, {
              "customId": "port_0ddb2da7",
              "group": "top",
              "label": {
                "direction": "input",
                "name": "img_name",
                "type": "string",
                "require": false,
                "alias": "img_name"
              },
              "color": "#165b5c",
              "id": "9c65211b-8867-4cb5-8f39-8a21cee512ce"
            }, {
              "customId": "port_4f452295",
              "group": "bottom",
              "label": {
                "direction": "output",
                "name": "status",
                "type": "bool",
                "alias": "status"
              },
              "color": "#7d573a",
              "id": "5bdac4c1-3403-47c9-b7a4-7e5fb789559b"
            }, {
              "customId": "port_a20d197c",
              "group": "bottom",
              "label": {
                "direction": "output",
                "name": "category",
                "type": "string",
                "alias": "category"
              },
              "color": "#165b5c",
              "id": "28eae3a6-f1d8-4e16-88c9-6e385cac052f"
            }, {
              "customId": "port_854a6544",
              "group": "bottom",
              "label": {
                "direction": "output",
                "name": "store_path",
                "type": "string",
                "alias": "store_path"
              },
              "color": "#165b5c",
              "id": "14306f65-e705-4ca7-8769-cc093726a35c"
            }]
          },
          "position": {
            "x": 830.0000000000011,
            "y": 1370.0000000000027
          },
          "size": {
            "width": 444,
            "height": 130
          },
          "dropDownCheckBox": ["result"],
          "parent": "group_490b7b77"
        }, {
          "name": "Responser.json",
          "version": "0.0.1",
          "category": "COMM",
          "description": "This is COMM Responser",
          "author": "lw-Sany",
          "repository": "https://github.com/UBV/ResultParser",
          "bugs": "https://github.com/UBV/ResultParser/issues",
          "config": {
            "module": "COMM__A__Responser",
            "executor": "Responser",
            "initParams": {
              "respond_to": {
                "name": "respond_to",
                "alias": "respond_to",
                "require": false,
                "type": "string",
                "widget": {
                  "type": "Input"
                },
                "value": "1fbf97c8-d887-43a5-8f2c-ed198e098b8b"
              }
            },
            "input": {
              "response": {
                "type": "string",
                "require": true,
                "alias": "response"
              }
            },
            "output": {}
          },
          "alias": "TCP-Responser.json",
          "buildIn": false,
          "useGpu": false,
          "codeEditor": false,
          "id": "b4f890bc-3254-4e03-a4bb-7e16b8d5534d",
          "_id": "IIPdi27QjBzC76Ag",
          "createdAt": "2022-06-05T15:14:02.102Z",
          "updatedAt": "2022-07-13T11:03:30.387Z",
          "ifShow": true,
          "customId": "node_bf76a6ee",
          "ports": {
            "groups": {
              "top": {
                "position": "top",
                "attrs": {
                  "fo": {
                    "r": 6,
                    "magnet": true,
                    "strokeWidth": 1,
                    "fill": "#fff"
                  }
                }
              },
              "bottom": {
                "position": "bottom",
                "attrs": {
                  "fo": {
                    "r": 6,
                    "magnet": true,
                    "strokeWidth": 1,
                    "fill": "#fff"
                  }
                }
              }
            },
            "items": [{
              "customId": "port_7987924e",
              "group": "top",
              "label": {
                "direction": "input",
                "name": "response",
                "type": "string",
                "require": true,
                "alias": "response"
              },
              "color": "#165b5c",
              "id": "b6e929c7-606a-477d-9de1-9c5751936aca"
            }]
          },
          "position": {
            "x": 540.0000000000011,
            "y": 2280.0000000000027
          },
          "size": {
            "width": 300,
            "height": 130
          },
          "dropDownCheckBox": [],
          "parent": "group_490b7b77"
        }, {
          "name": "Glue_Trigger_Parser",
          "version": "1.0.0",
          "category": "TOOL",
          "description": "TOOL__C__Glue_Trigger_Parser",
          "author": "sf-Sany",
          "config": {
            "module": "TOOL__C__Glue_Trigger_Parser",
            "executor": "parse",
            "initParams": {},
            "input": {
              "origin_str": {
                "type": "string",
                "require": true,
                "alias": "origin_str"
              }
            },
            "output": {
              "camera": {
                "type": "string",
                "alias": "camera"
              },
              "heart": {
                "type": "string",
                "alias": "heart"
              }
            },
            "group": []
          },
          "updatedAt": "2022-07-13T13:14:32.108Z",
          "id": "3e41e3d3-2ef4-44fc-9771-d352e634dfdf",
          "_id": "cONUuPsSLoL8Rx5F",
          "createdAt": "2022-07-13T13:14:24.753Z",
          "alias": "Glue_Trigger_Parser",
          "buildIn": false,
          "useGpu": false,
          "ifShow": true,
          "customId": "node_d2946b47",
          "ports": {
            "groups": {
              "top": {
                "position": "top",
                "attrs": {
                  "fo": {
                    "r": 6,
                    "magnet": true,
                    "strokeWidth": 1,
                    "fill": "#fff"
                  }
                }
              },
              "bottom": {
                "position": "bottom",
                "attrs": {
                  "fo": {
                    "r": 6,
                    "magnet": true,
                    "strokeWidth": 1,
                    "fill": "#fff"
                  }
                }
              }
            },
            "items": [{
              "customId": "port_57fac917",
              "group": "top",
              "label": {
                "direction": "input",
                "name": "origin_str",
                "type": "string",
                "require": true,
                "alias": "origin_str"
              },
              "color": "#165b5c",
              "id": "627134a1-328f-4aa2-8125-efef9f5b23ec"
            }, {
              "customId": "port_b8f22edb",
              "group": "bottom",
              "label": {
                "direction": "output",
                "name": "camera",
                "type": "string",
                "alias": "camera"
              },
              "color": "#165b5c",
              "id": "c2aeed53-807a-49ea-b265-6f0f206064d6"
            }, {
              "customId": "port_0c5a998c",
              "group": "bottom",
              "label": {
                "direction": "output",
                "name": "heart",
                "type": "string",
                "alias": "heart"
              },
              "color": "#165b5c",
              "id": "8852db72-a768-43d3-b57d-be7443a0202b"
            }]
          },
          "position": {
            "x": 1380,
            "y": 650.0000000000003
          },
          "size": {
            "width": 300,
            "height": 130
          },
          "dropDownCheckBox": [],
          "parent": "group_6a56067b"
        }, {
          "alias": "AIEngine",
          "name": "AIEngine",
          "description": "This is an ai engine plugin for industrial visual quality inspection\n2022.7.1",
          "version": "0.1.0",
          "buildIn": false,
          "useGpu": true,
          "category": "CV",
          "config": {
            "module": "CV__B__AIEngine",
            "executor": "AIEngine",
            "initParams": {
              "config_path": {
                "name": "config_path",
                "alias": "config_path",
                "require": false,
                "type": "File",
                "widget": {
                  "type": "File",
                  "suffix": [".jpg/.jpeg", ".png", ".svg", ".pdf", ".pt", ".py", ".doc/.docx", ".csv", ".bmp", ".json", "all"]
                },
                "value": "/opt/ubvision/tujiao/resources/configs/seg_swin_transformer_st_tujiao.json"
              },
              "model_path": {
                "name": "model_path",
                "alias": "model_path",
                "require": false,
                "type": "File",
                "widget": {
                  "type": "File",
                  "suffix": [".jpg/.jpeg", ".png", ".svg", ".pdf", ".pt", ".py", ".doc/.docx", ".csv", ".bmp", ".json", "all"]
                },
                "value": "/opt/ubvision/tujiao/resources/models/iter_44000_w1024xh1024_sim_fp32.engine"
              }
            },
            "input": {
              "srcImg": {
                "type": "numpy.ndarray",
                "require": true,
                "alias": "srcImg"
              }
            },
            "output": {
              "class_name": {
                "type": "list",
                "alias": "class_name"
              },
              "masks": {
                "type": "numpy.ndarray",
                "alias": "masks"
              },
              "shapes": {
                "type": "dict",
                "alias": "shapes"
              },
              "status": {
                "type": "bool",
                "alias": "status"
              }
            },
            "group": []
          },
          "author": "zwt-Sany",
          "repository": "https://github.com/QIVG/AlgorithmPluginDemo",
          "bugs": "https://github.com/QIVG/AlgorithmPluginDemo/issues",
          "_id": "Ug3bhG8x9kYJHpGM",
          "createdAt": "2022-06-17T13:08:34.434Z",
          "updatedAt": "2022-07-14T18:56:31.404Z",
          "id": "1f90147b-c49c-4884-803f-1c97f9824655",
          "ifShow": true,
          "customId": "node_84079990",
          "ports": {
            "groups": {
              "top": {
                "position": "top",
                "attrs": {
                  "fo": {
                    "r": 6,
                    "magnet": true,
                    "strokeWidth": 1,
                    "fill": "#fff"
                  }
                }
              },
              "bottom": {
                "position": "bottom",
                "attrs": {
                  "fo": {
                    "r": 6,
                    "magnet": true,
                    "strokeWidth": 1,
                    "fill": "#fff"
                  }
                }
              }
            },
            "items": [{
              "customId": "port_c79f6953",
              "group": "top",
              "label": {
                "direction": "input",
                "name": "srcImg",
                "type": "numpy.ndarray",
                "require": true,
                "alias": "srcImg"
              },
              "color": "#1acccf",
              "id": "32f85b78-82b7-4bd8-b2c9-43a3a5a7903f"
            }, {
              "customId": "port_e9d93c82",
              "group": "bottom",
              "label": {
                "direction": "output",
                "name": "class_name",
                "type": "list",
                "alias": "class_name"
              },
              "color": "#694256",
              "id": "ffde9a57-9e5b-43a2-aeef-47e4f0fb0c8e"
            }, {
              "customId": "port_5d4da216",
              "group": "bottom",
              "label": {
                "direction": "output",
                "name": "masks",
                "type": "numpy.ndarray",
                "alias": "masks"
              },
              "color": "#1acccf",
              "id": "3419b89d-70be-479c-9877-75ce3bcfdf98"
            }, {
              "customId": "port_7d268669",
              "group": "bottom",
              "label": {
                "direction": "output",
                "name": "shapes",
                "type": "dict",
                "alias": "shapes"
              },
              "color": "#425e7e",
              "id": "a9186b9f-850a-4a0b-8eb2-aa9ad5ee9c6d"
            }, {
              "customId": "port_369b74fd",
              "group": "bottom",
              "label": {
                "direction": "output",
                "name": "status",
                "type": "bool",
                "alias": "status"
              },
              "color": "#7d573a",
              "id": "d6bdeada-adea-41de-8f90-426e5c945318"
            }]
          },
          "position": {
            "x": 1380.0000000000011,
            "y": 1350.0000000000027
          },
          "size": {
            "width": 592,
            "height": 130
          },
          "dropDownCheckBox": [],
          "parent": "group_490b7b77"
        }, {
          "alias": "GalaxyCamera",
          "name": "GalaxyCamera",
          "description": "GalaxyCamera",
          "version": "0.1.0",
          "buildIn": false,
          "useGpu": false,
          "category": "CAPTURE",
          "config": {
            "module": "CAPTURE__B__GalaxyCamera",
            "executor": "Camera",
            "initParams": {
              "camera_name": {
                "name": "camera_name",
                "alias": "camera_name",
                "require": false,
                "default": "DefaultCam",
                "value": "DefaultCam",
                "type": "string",
                "widget": {
                  "type": "Input"
                }
              },
              "serial_number": {
                "name": "serial_number",
                "alias": "serial_number",
                "require": true,
                "default": " ",
                "value": "LT0210051918",
                "type": "string",
                "widget": {
                  "type": "Input"
                }
              },
              "exposure_time": {
                "name": "exposure_time",
                "alias": "exposure_time",
                "require": true,
                "default": 5000,
                "value": 1500,
                "type": "int",
                "widget": {
                  "type": "InputNumber",
                  "max": 100000,
                  "min": 500,
                  "step": 100,
                  "precision": 0
                }
              },
              "data_format": {
                "name": "data_format",
                "alias": "data_format",
                "require": false,
                "default": "RGB",
                "value": "RGB",
                "type": "List[string]",
                "widget": {
                  "type": "Radio",
                  "options": ["RGB", "GRAY", "RAW"]
                }
              },
              "interval_time": {
                "name": "interval_time",
                "alias": "interval_time",
                "require": true,
                "default": 0,
                "type": "float",
                "widget": {
                  "type": "InputNumber",
                  "max": 5,
                  "min": 0,
                  "step": 0.05,
                  "precision": 2
                },
                "value": 0.1
              },
              "width": {
                "type": "float",
                "default": 2048,
                "require": false,
                "widget": {
                  "type": "InputNumber",
                  "max": 6000,
                  "min": 100,
                  "step": 1,
                  "precision": 1
                },
                "value": 5496,
                "alias": "width",
                "name": "width"
              },
              "height": {
                "type": "float",
                "default": 2048,
                "require": false,
                "widget": {
                  "type": "InputNumber",
                  "max": 6000,
                  "min": 100,
                  "step": 1,
                  "precision": 1
                },
                "value": 3672,
                "alias": "height",
                "name": "height"
              },
              "DEV_MAPPER": {
                "type": "str",
                "default": "/dev/bus/usb",
                "value": "/dev/bus/usb",
                "require": true,
                "widget": {
                  "type": "Input"
                },
                "alias": "DEV_MAPPER",
                "name": "DEV_MAPPER"
              },
              "NETWORKMODE": {
                "default": "host",
                "require": true,
                "value": "host",
                "type": "List[string]",
                "widget": {
                  "type": "Radio",
                  "options": ["host", "bridge"]
                },
                "alias": "NETWORKMODE",
                "name": "NETWORKMODE"
              },
              "Gain": {
                "name": "Gain",
                "alias": "Gain",
                "require": true,
                "default": 10,
                "value": 10,
                "type": "float",
                "widget": {
                  "type": "Slider",
                  "max": 20,
                  "min": 0.1,
                  "step": 0.1
                }
              }
            },
            "input": {
              "signal": {
                "type": "string",
                "require": true,
                "alias": "signal"
              }
            },
            "output": {
              "frame": {
                "type": "numpy.ndarray",
                "alias": "frame"
              },
              "category": {
                "type": "string",
                "alias": "category"
              },
              "status": {
                "type": "bool",
                "alias": "status"
              }
            },
            "group": [{
              "id": "76a2eea9",
              "open": false,
              "children": ["NETWORKMODE", "DEV_MAPPER"],
              "name": "Advanced Options"
            }]
          },
          "author": "liwen",
          "_id": "UEpwqYTvke6un0Rs",
          "createdAt": "2022-07-10T03:06:07.682Z",
          "updatedAt": "2022-07-15T07:45:51.867Z",
          "id": "c98381bf-8e21-443b-b241-ee8a07d11b7b",
          "ifShow": true,
          "customId": "node_0bb7ada6",
          "ports": {
            "groups": {
              "top": {
                "position": "top",
                "attrs": {
                  "fo": {
                    "r": 6,
                    "magnet": true,
                    "strokeWidth": 1,
                    "fill": "#fff"
                  }
                }
              },
              "bottom": {
                "position": "bottom",
                "attrs": {
                  "fo": {
                    "r": 6,
                    "magnet": true,
                    "strokeWidth": 1,
                    "fill": "#fff"
                  }
                }
              }
            },
            "items": [{
              "customId": "port_b776d46c",
              "group": "top",
              "label": {
                "direction": "input",
                "name": "signal",
                "type": "string",
                "require": true,
                "alias": "signal"
              },
              "color": "#165b5c",
              "id": "8c3b5c46-5934-496d-ac5f-d8b1ca403188"
            }, {
              "customId": "port_42c40766",
              "group": "bottom",
              "label": {
                "direction": "output",
                "name": "frame",
                "type": "numpy.ndarray",
                "alias": "frame"
              },
              "color": "#1acccf",
              "id": "7961fb07-7eec-443e-91c5-6a3177732566"
            }, {
              "customId": "port_a7b8fbcc",
              "group": "bottom",
              "label": {
                "direction": "output",
                "name": "category",
                "type": "string",
                "alias": "category"
              },
              "color": "#165b5c",
              "id": "51510414-8a0c-49f6-a6b0-3eec528bed65"
            }, {
              "customId": "port_ddc16065",
              "group": "bottom",
              "label": {
                "direction": "output",
                "name": "status",
                "type": "bool",
                "alias": "status"
              },
              "color": "#7d573a",
              "id": "7837188d-ec7e-440a-b1d1-396334560acf"
            }]
          },
          "position": {
            "x": 810.0000000000011,
            "y": 1060.0000000000027
          },
          "size": {
            "width": 444,
            "height": 130
          },
          "dropDownCheckBox": [],
          "parent": "group_490b7b77"
        }, {
          "alias": "服务TCPServer",
          "name": "TcpServer",
          "description": "TCP服务插件，跟监听指定端口的请求，并根据\"默认异常响应信息\"和 \"异常中断响应表\" 进行响应",
          "version": "0.0.2",
          "buildIn": false,
          "useGpu": false,
          "category": "SERV",
          "config": {
            "module": "SERV__A__TcpServer",
            "executor": "TcpServer",
            "initParams": {
              "port": {
                "name": "port",
                "alias": "port",
                "require": true,
                "default": 2000,
                "value": 5546,
                "type": "int",
                "description": "监听端口",
                "widget": {
                  "type": "InputNumber",
                  "max": 65535,
                  "min": 1000,
                  "step": 1,
                  "precision": 0
                }
              },
              "default_res_msg": {
                "name": "default_res_msg",
                "alias": "默认异常响应信息",
                "require": true,
                "default": "ERROR",
                "value": "ERROR",
                "type": "string",
                "description": "默认异常响应信息",
                "widget": {
                  "type": "Input"
                }
              },
              "response_template": {
                "name": "response_template",
                "alias": "异常中断响应表",
                "require": false,
                "default": "{}",
                "type": "string",
                "widget": {
                  "type": "codeEditor"
                },
                "value": "{}"
              }
            },
            "input": {},
            "output": {
              "message": {
                "type": "string",
                "alias": "message"
              }
            },
            "group": []
          },
          "author": "liwen",
          "repository": "https://github.com/UBV/TcpServer",
          "bugs": "https://github.com/UBV/TcpServer/issues",
          "id": "a1d8d2a3-3c96-4862-904e-a874bef76a57",
          "_id": "1DBwzaY2tR0lAQ2J",
          "createdAt": "2022-06-21T10:16:06.395Z",
          "updatedAt": "2022-07-14T18:56:31.402Z",
          "ifShow": true,
          "customId": "node_72eca6e4",
          "ports": {
            "groups": {
              "top": {
                "position": "top",
                "attrs": {
                  "fo": {
                    "r": 6,
                    "magnet": true,
                    "strokeWidth": 1,
                    "fill": "#fff"
                  }
                }
              },
              "bottom": {
                "position": "bottom",
                "attrs": {
                  "fo": {
                    "r": 6,
                    "magnet": true,
                    "strokeWidth": 1,
                    "fill": "#fff"
                  }
                }
              }
            },
            "items": [{
              "customId": "port_82c0c610",
              "group": "bottom",
              "label": {
                "direction": "output",
                "name": "message",
                "type": "string",
                "alias": "message"
              },
              "color": "#165b5c",
              "id": "9591d6e0-64ca-4d8c-b42b-29f439ac3e0f"
            }]
          },
          "position": {
            "x": -240,
            "y": 1160
          },
          "size": {
            "width": 300,
            "height": 130
          },
          "dropDownCheckBox": [],
          "parent": "group_e0278e38"
        }, {
          "alias": "Glue_Trigger_Parser",
          "name": "Glue_Trigger_Parser",
          "description": "TOOL__C__Glue_Trigger_Parser",
          "version": "1.0.0",
          "buildIn": false,
          "useGpu": false,
          "category": "TOOL",
          "config": {
            "module": "TOOL__C__Glue_Trigger_Parser",
            "executor": "parse",
            "initParams": {},
            "input": {
              "origin_str": {
                "type": "string",
                "require": true,
                "alias": "origin_str"
              }
            },
            "output": {
              "camera": {
                "type": "string",
                "alias": "camera"
              },
              "heart": {
                "type": "string",
                "alias": "heart"
              }
            },
            "group": []
          },
          "author": "sf-Sany",
          "updatedAt": "2022-07-19T11:58:18.297Z",
          "id": "b5fef33b-ede1-4d8a-888c-2bbfce294b98",
          "_id": "ywHaV9aVLeaakgcn",
          "createdAt": "2022-07-19T11:57:49.555Z",
          "ifShow": true,
          "customId": "node_1f183bca",
          "ports": {
            "groups": {
              "top": {
                "position": "top",
                "attrs": {
                  "fo": {
                    "r": 6,
                    "magnet": true,
                    "strokeWidth": 1,
                    "fill": "#fff"
                  }
                }
              },
              "bottom": {
                "position": "bottom",
                "attrs": {
                  "fo": {
                    "r": 6,
                    "magnet": true,
                    "strokeWidth": 1,
                    "fill": "#fff"
                  }
                }
              }
            },
            "items": [{
              "customId": "port_ec6ea7e6",
              "group": "top",
              "label": {
                "direction": "input",
                "name": "origin_str",
                "type": "string",
                "require": true,
                "alias": "origin_str"
              },
              "color": "#165b5c",
              "id": "88ffbb5b-d26a-42d3-9f91-337e0436d92a"
            }, {
              "customId": "port_90b1f6d0",
              "group": "bottom",
              "label": {
                "direction": "output",
                "name": "camera",
                "type": "string",
                "alias": "camera"
              },
              "color": "#165b5c",
              "id": "fbcc3c56-0d77-4a49-adf0-2dbf14f03400"
            }, {
              "customId": "port_4a8425fd",
              "group": "bottom",
              "label": {
                "direction": "output",
                "name": "heart",
                "type": "string",
                "alias": "heart"
              },
              "color": "#165b5c",
              "id": "058e4bdb-167e-48f4-9188-3273baff14e4"
            }]
          },
          "position": {
            "x": -250,
            "y": 1600
          },
          "size": {
            "width": 300,
            "height": 130
          },
          "dropDownCheckBox": [],
          "parent": "group_e0278e38"
        }, {
          "alias": "TCP-Responser",
          "name": "Responser",
          "description": "This is COMM Responser",
          "version": "0.0.1",
          "buildIn": false,
          "useGpu": false,
          "category": "COMM",
          "config": {
            "module": "COMM__A__Responser",
            "executor": "Responser",
            "initParams": {
              "respond_to": {
                "name": "respond_to",
                "alias": "respond_to",
                "require": false,
                "type": "string",
                "widget": {
                  "type": "Input"
                },
                "value": "a1d8d2a3-3c96-4862-904e-a874bef76a57"
              }
            },
            "input": {
              "response": {
                "type": "string",
                "require": true,
                "alias": "response"
              }
            },
            "output": {}
          },
          "author": "lw-Sany",
          "repository": "https://github.com/UBV/ResultParser",
          "bugs": "https://github.com/UBV/ResultParser/issues",
          "codeEditor": false,
          "id": "b78ac9ce-d8f4-4e76-84eb-f38cf12a992a",
          "_id": "IIPdi27QjBzC76Ag",
          "createdAt": "2022-06-05T15:14:02.102Z",
          "updatedAt": "2022-07-14T18:56:31.401Z",
          "ifShow": true,
          "customId": "node_8a9c1478",
          "ports": {
            "groups": {
              "top": {
                "position": "top",
                "attrs": {
                  "fo": {
                    "r": 6,
                    "magnet": true,
                    "strokeWidth": 1,
                    "fill": "#fff"
                  }
                }
              },
              "bottom": {
                "position": "bottom",
                "attrs": {
                  "fo": {
                    "r": 6,
                    "magnet": true,
                    "strokeWidth": 1,
                    "fill": "#fff"
                  }
                }
              }
            },
            "items": [{
              "customId": "port_59b0c7f5",
              "group": "top",
              "label": {
                "direction": "input",
                "name": "response",
                "type": "string",
                "require": true,
                "alias": "response"
              },
              "color": "#165b5c",
              "id": "b97034ff-227c-4f7f-bb0d-8ad3248ba819"
            }]
          },
          "position": {
            "x": -240,
            "y": 2050
          },
          "size": {
            "width": 300,
            "height": 130
          },
          "dropDownCheckBox": [],
          "parent": "group_e0278e38"
        }, {
          "alias": "DataServer",
          "name": "DataServer",
          "description": "This is a DataServer plugin",
          "version": "0.0.1",
          "buildIn": false,
          "useGpu": false,
          "category": "TOOL",
          "config": {
            "module": "TOOL__C__DataServer",
            "executor": "DataServer",
            "initParams": {},
            "input": {
              "status": {
                "type": "int",
                "require": true,
                "alias": "status"
              },
              "show_img_path": {
                "type": "string",
                "require": false,
                "alias": "show_img_path"
              }
            },
            "output": {},
            "group": []
          },
          "author": "liwen",
          "updatedAt": "2022-07-21T04:56:06.372Z",
          "_id": "bf1BpfxQGLUzkw2c",
          "createdAt": "2022-07-14T01:21:14.656Z",
          "id": "dc4e22e5-a1fe-4d99-9f2b-01367e813b1b",
          "ifShow": true,
          "customId": "node_45487823",
          "ports": {
            "groups": {
              "top": {
                "position": "top",
                "attrs": {
                  "fo": {
                    "r": 6,
                    "magnet": true,
                    "strokeWidth": 1,
                    "fill": "#fff"
                  }
                }
              },
              "bottom": {
                "position": "bottom",
                "attrs": {
                  "fo": {
                    "r": 6,
                    "magnet": true,
                    "strokeWidth": 1,
                    "fill": "#fff"
                  }
                }
              }
            },
            "items": [{
              "customId": "port_efc2214c",
              "group": "top",
              "label": {
                "direction": "input",
                "name": "status",
                "type": "int",
                "require": true,
                "alias": "status"
              },
              "color": "#7a3f59",
              "id": "91a87f00-4441-4857-8dae-dfc363367917"
            }, {
              "customId": "port_25177c19",
              "group": "top",
              "label": {
                "direction": "input",
                "name": "show_img_path",
                "type": "string",
                "require": false,
                "alias": "show_img_path"
              },
              "color": "#165b5c",
              "id": "2712f986-c147-49dc-8f9a-ffd4a6f07f90"
            }]
          },
          "position": {
            "x": 850.0000000000011,
            "y": 2590.0000000000027
          },
          "size": {
            "width": 300,
            "height": 130
          },
          "dropDownCheckBox": [],
          "parent": "group_490b7b77"
        }, {
          "alias": "Glue_Responser_Parser",
          "name": "Glue_Responser_Parser",
          "description": "TOOL__C__Glue_Responser_Parser",
          "version": "1.0.0",
          "buildIn": false,
          "useGpu": false,
          "category": "TOOL",
          "config": {
            "module": "TOOL__C__Glue_Responser_Parser",
            "executor": "parse",
            "initParams": {},
            "input": {
              "status": {
                "type": "int",
                "require": true,
                "alias": "status"
              }
            },
            "output": {
              "message": {
                "type": "string",
                "alias": "message"
              }
            },
            "group": []
          },
          "author": "sf-Sany",
          "updatedAt": "2022-07-21T05:03:56.951Z",
          "id": "8989a55c-1f87-404a-8135-58dab5225829",
          "_id": "FfSVdxh6bFjrCZKe",
          "createdAt": "2022-07-21T05:03:51.617Z",
          "ifShow": true,
          "customId": "node_86392e2f",
          "ports": {
            "groups": {
              "top": {
                "position": "top",
                "attrs": {
                  "fo": {
                    "r": 6,
                    "magnet": true,
                    "strokeWidth": 1,
                    "fill": "#fff"
                  }
                }
              },
              "bottom": {
                "position": "bottom",
                "attrs": {
                  "fo": {
                    "r": 6,
                    "magnet": true,
                    "strokeWidth": 1,
                    "fill": "#fff"
                  }
                }
              }
            },
            "items": [{
              "customId": "port_a1e0e149",
              "group": "top",
              "label": {
                "direction": "input",
                "name": "status",
                "type": "int",
                "require": true,
                "alias": "status"
              },
              "color": "#7a3f59",
              "id": "6015e6e3-466d-4099-ae40-413e5e2b4ee4"
            }, {
              "customId": "port_d5ae06df",
              "group": "bottom",
              "label": {
                "direction": "output",
                "name": "message",
                "type": "string",
                "alias": "message"
              },
              "color": "#165b5c",
              "id": "a3a0a2a0-48e1-41c1-93fa-21e92497380f"
            }]
          },
          "position": {
            "x": 550.0000000000011,
            "y": 1990.0000000000027
          },
          "size": {
            "width": 300,
            "height": 130
          },
          "dropDownCheckBox": [],
          "parent": "group_490b7b77"
        }, {
          "alias": "Business_Glue_Station",
          "name": "Business_Glue_Station",
          "description": "This is a business  plugin for Glue station",
          "version": "0.0.1",
          "buildIn": false,
          "useGpu": false,
          "category": "CV",
          "config": {
            "module": "CV__C__Business_Glue_Station",
            "executor": "Business_Glue_Station",
            "initParams": {
              "glue_width_max": {
                "name": "glue_width_max",
                "alias": "glue_width_max",
                "require": false,
                "value": 80,
                "type": "int",
                "widget": {
                  "type": "InputNumber",
                  "max": 300,
                  "min": 0,
                  "step": 1,
                  "precision": 0
                }
              },
              "glue_width_min": {
                "name": "glue_width_min",
                "alias": "glue_width_min",
                "require": false,
                "value": 1,
                "type": "int",
                "widget": {
                  "type": "InputNumber",
                  "max": 300,
                  "min": 0,
                  "step": 1,
                  "precision": 0
                }
              }
            },
            "input": {
              "srcImg": {
                "type": "numpy.ndarray",
                "require": true,
                "alias": "srcImg"
              },
              "maskImg": {
                "type": "numpy.ndarray",
                "require": true,
                "alias": "maskImg"
              }
            },
            "output": {
              "status": {
                "type": "int",
                "alias": "status"
              },
              "showImg": {
                "type": "numpy.ndarray",
                "alias": "showImg"
              }
            },
            "group": []
          },
          "author": "Sany-ShenFei",
          "updatedAt": "2022-07-21T05:10:19.588Z",
          "id": "00798d3e-b188-4dec-a9bb-094552db721b",
          "_id": "rwz6WHooi52rSoQo",
          "createdAt": "2022-07-21T05:00:31.271Z",
          "ifShow": true,
          "customId": "node_90cc8e9d",
          "ports": {
            "groups": {
              "top": {
                "position": "top",
                "attrs": {
                  "fo": {
                    "r": 6,
                    "magnet": true,
                    "strokeWidth": 1,
                    "fill": "#fff"
                  }
                }
              },
              "bottom": {
                "position": "bottom",
                "attrs": {
                  "fo": {
                    "r": 6,
                    "magnet": true,
                    "strokeWidth": 1,
                    "fill": "#fff"
                  }
                }
              }
            },
            "items": [{
              "customId": "port_491f4c24",
              "group": "top",
              "label": {
                "direction": "input",
                "name": "srcImg",
                "type": "numpy.ndarray",
                "require": true,
                "alias": "srcImg"
              },
              "color": "#1acccf",
              "id": "1a2addf1-bd70-47bd-99dd-c436db43a226"
            }, {
              "customId": "port_c8b102bf",
              "group": "top",
              "label": {
                "direction": "input",
                "name": "maskImg",
                "type": "numpy.ndarray",
                "require": true,
                "alias": "maskImg"
              },
              "color": "#1acccf",
              "id": "0551c2e5-658e-4cb4-ba93-19afc1f138d1"
            }, {
              "customId": "port_e1b3adac",
              "group": "bottom",
              "label": {
                "direction": "output",
                "name": "status",
                "type": "int",
                "alias": "status"
              },
              "color": "#7a3f59",
              "id": "a7f6b04f-baa7-4a5e-901c-d41889514c80"
            }, {
              "customId": "port_d4718e1c",
              "group": "bottom",
              "label": {
                "direction": "output",
                "name": "showImg",
                "type": "numpy.ndarray",
                "alias": "showImg"
              },
              "color": "#1acccf",
              "id": "ce651fd7-c5f2-4e6b-a719-6f877a53ca65"
            }]
          },
          "position": {
            "x": 880.0000000000011,
            "y": 1690.0000000000027
          },
          "size": {
            "width": 300,
            "height": 130
          },
          "dropDownCheckBox": [],
          "parent": "group_490b7b77"
        }, {
          "alias": "服务TCPServer",
          "name": "TcpServer",
          "description": "TCP服务插件，跟监听指定端口的请求，并根据\"默认异常响应信息\"和 \"异常中断响应表\" 进行响应",
          "version": "0.0.2",
          "buildIn": false,
          "useGpu": false,
          "category": "SERV",
          "config": {
            "module": "SERV__A__TcpServer",
            "executor": "TcpServer",
            "initParams": {
              "port": {
                "name": "port",
                "alias": "port",
                "require": true,
                "default": 2000,
                "value": 5547,
                "type": "int",
                "description": "监听端口",
                "widget": {
                  "type": "InputNumber",
                  "max": 65535,
                  "min": 1000,
                  "step": 1,
                  "precision": 0
                }
              },
              "default_res_msg": {
                "name": "default_res_msg",
                "alias": "默认异常响应信息",
                "require": true,
                "default": "ERROR",
                "value": "ERROR",
                "type": "string",
                "description": "默认异常响应信息",
                "widget": {
                  "type": "Input"
                }
              },
              "response_template": {
                "name": "response_template",
                "alias": "异常中断响应表",
                "require": false,
                "default": "{}",
                "type": "string",
                "widget": {
                  "type": "codeEditor"
                },
                "value": "{}"
              }
            },
            "input": {},
            "output": {
              "message": {
                "type": "string",
                "alias": "message"
              }
            },
            "group": []
          },
          "author": "liwen",
          "repository": "https://github.com/UBV/TcpServer",
          "bugs": "https://github.com/UBV/TcpServer/issues",
          "id": "bbdd935f-f587-4db9-ad66-f32caec4d18b",
          "_id": "1DBwzaY2tR0lAQ2J",
          "createdAt": "2022-06-21T10:16:06.395Z",
          "updatedAt": "2022-07-14T18:56:31.402Z",
          "ifShow": true,
          "customId": "node_45ed4f5c",
          "ports": {
            "groups": {
              "top": {
                "position": "top",
                "attrs": {
                  "fo": {
                    "r": 6,
                    "magnet": true,
                    "strokeWidth": 1,
                    "fill": "#fff"
                  }
                }
              },
              "bottom": {
                "position": "bottom",
                "attrs": {
                  "fo": {
                    "r": 6,
                    "magnet": true,
                    "strokeWidth": 1,
                    "fill": "#fff"
                  }
                }
              }
            },
            "items": [{
              "customId": "port_688d2b5c",
              "group": "bottom",
              "label": {
                "direction": "output",
                "name": "message",
                "type": "string",
                "alias": "message"
              },
              "color": "#165b5c",
              "id": "a0ae4b81-5784-4661-b4d5-400266424ccd"
            }]
          },
          "position": {
            "x": 600,
            "y": 640
          },
          "dropDownCheckBox": [],
          "size": {
            "width": 300,
            "height": 130
          }
        }],
        "edges": [{
          "shape": "dag-edge",
          "attrs": {
            "line": {
              "stroke": "#165b5c",
              "strokeWidth": 6,
              "strokeDasharray": ""
            }
          },
          "zIndex": 0,
          "id": "31632592-8086-42b8-938a-de01e4ed5ba8",
          "parent": "group_e0278e38",
          "data": {
            "status": "STOPPED",
            "graphLock": false,
            "guid": "4f97ab41"
          },
          "source": {
            "cell": "b5fef33b-ede1-4d8a-888c-2bbfce294b98",
            "port": "058e4bdb-167e-48f4-9188-3273baff14e4"
          },
          "target": {
            "cell": "b78ac9ce-d8f4-4e76-84eb-f38cf12a992a",
            "port": "b97034ff-227c-4f7f-bb0d-8ad3248ba819"
          }
        }, {
          "shape": "dag-edge",
          "attrs": {
            "line": {
              "stroke": "#165b5c",
              "strokeWidth": 6,
              "strokeDasharray": ""
            }
          },
          "zIndex": 0,
          "id": "daec7b08-45f6-4891-974b-bc9a198a8238",
          "parent": "group_e0278e38",
          "data": {
            "status": "STOPPED",
            "graphLock": false,
            "guid": "bdd8acb0"
          },
          "source": {
            "cell": "a1d8d2a3-3c96-4862-904e-a874bef76a57",
            "port": "9591d6e0-64ca-4d8c-b42b-29f439ac3e0f"
          },
          "target": {
            "cell": "b5fef33b-ede1-4d8a-888c-2bbfce294b98",
            "port": "88ffbb5b-d26a-42d3-9f91-337e0436d92a"
          }
        }, {
          "shape": "dag-edge",
          "attrs": {
            "line": {
              "stroke": "#1acccf",
              "strokeWidth": 6,
              "strokeDasharray": ""
            }
          },
          "zIndex": 0,
          "id": "3b4fd793-123a-440d-ac6a-507e687acfb0",
          "parent": "group_490b7b77",
          "data": {
            "status": "STOPPED",
            "graphLock": false,
            "guid": "c746c605"
          },
          "source": {
            "cell": "c98381bf-8e21-443b-b241-ee8a07d11b7b",
            "port": "7961fb07-7eec-443e-91c5-6a3177732566"
          },
          "target": {
            "cell": "00798d3e-b188-4dec-a9bb-094552db721b",
            "port": "1a2addf1-bd70-47bd-99dd-c436db43a226"
          }
        }, {
          "shape": "dag-edge",
          "attrs": {
            "line": {
              "stroke": "#1acccf",
              "strokeWidth": 6,
              "strokeDasharray": ""
            }
          },
          "zIndex": 0,
          "id": "7fc677de-9e0c-4d08-a895-ce783dfe2928",
          "data": {
            "status": "STOPPED",
            "graphLock": false,
            "guid": "68bd30c1"
          },
          "parent": "group_490b7b77",
          "source": {
            "cell": "c98381bf-8e21-443b-b241-ee8a07d11b7b",
            "port": "7961fb07-7eec-443e-91c5-6a3177732566"
          },
          "target": {
            "cell": "56284350-1bc5-465f-b7d4-2c7fbe94097d",
            "port": "7c77e391-3961-4bbb-b009-a347149b449e"
          }
        }, {
          "shape": "dag-edge",
          "attrs": {
            "line": {
              "stroke": "#165b5c",
              "strokeWidth": 6,
              "strokeDasharray": ""
            }
          },
          "zIndex": 0,
          "id": "b935179d-0abb-4141-9eee-313fe6d07003",
          "data": {
            "status": "STOPPED",
            "graphLock": false,
            "guid": "c285aaf4"
          },
          "parent": "group_490b7b77",
          "source": {
            "cell": "c98381bf-8e21-443b-b241-ee8a07d11b7b",
            "port": "51510414-8a0c-49f6-a6b0-3eec528bed65"
          },
          "target": {
            "cell": "56284350-1bc5-465f-b7d4-2c7fbe94097d",
            "port": "c74b7ffb-9cab-4583-92ec-9700ce552318"
          }
        }, {
          "shape": "dag-edge",
          "attrs": {
            "line": {
              "stroke": "#1acccf",
              "strokeWidth": 6,
              "strokeDasharray": ""
            }
          },
          "zIndex": 0,
          "id": "da5b3fdd-f8da-4b6a-9e21-bbbbe388d722",
          "data": {
            "status": "STOPPED",
            "graphLock": false,
            "guid": "c002a448"
          },
          "parent": "group_490b7b77",
          "source": {
            "cell": "c98381bf-8e21-443b-b241-ee8a07d11b7b",
            "port": "7961fb07-7eec-443e-91c5-6a3177732566"
          },
          "target": {
            "cell": "1f90147b-c49c-4884-803f-1c97f9824655",
            "port": "32f85b78-82b7-4bd8-b2c9-43a3a5a7903f"
          }
        }, {
          "shape": "dag-edge",
          "attrs": {
            "line": {
              "stroke": "#165b5c",
              "strokeWidth": 6,
              "strokeDasharray": ""
            }
          },
          "zIndex": 0,
          "id": "1bd00053-dd11-43d7-bb29-be47cbb15b3f",
          "source": {
            "cell": "3e41e3d3-2ef4-44fc-9771-d352e634dfdf",
            "port": "c2aeed53-807a-49ea-b265-6f0f206064d6"
          },
          "target": {
            "cell": "c98381bf-8e21-443b-b241-ee8a07d11b7b",
            "port": "8c3b5c46-5934-496d-ac5f-d8b1ca403188"
          }
        }, {
          "shape": "dag-edge",
          "attrs": {
            "line": {
              "stroke": "#7a3f59",
              "strokeWidth": 6,
              "strokeDasharray": ""
            }
          },
          "zIndex": 0,
          "id": "957cb389-aa29-42f7-b182-ea918580d9b0",
          "data": {
            "status": "STOPPED",
            "graphLock": false,
            "guid": "f303258c"
          },
          "parent": "group_490b7b77",
          "source": {
            "cell": "00798d3e-b188-4dec-a9bb-094552db721b",
            "port": "a7f6b04f-baa7-4a5e-901c-d41889514c80"
          },
          "target": {
            "cell": "8989a55c-1f87-404a-8135-58dab5225829",
            "port": "6015e6e3-466d-4099-ae40-413e5e2b4ee4"
          }
        }, {
          "shape": "dag-edge",
          "attrs": {
            "line": {
              "stroke": "#1acccf",
              "strokeWidth": 6,
              "strokeDasharray": ""
            }
          },
          "zIndex": 0,
          "id": "a367cd6d-29d2-4df9-9e78-b1b05a6286a8",
          "data": {
            "status": "STOPPED",
            "graphLock": false,
            "guid": "669c38bd"
          },
          "parent": "group_490b7b77",
          "source": {
            "cell": "00798d3e-b188-4dec-a9bb-094552db721b",
            "port": "ce651fd7-c5f2-4e6b-a719-6f877a53ca65"
          },
          "target": {
            "cell": "45e063e4-8d3e-4e10-a1cd-48be2f78e97a",
            "port": "71cb731c-4648-41d6-933a-946f2a0db521"
          }
        }, {
          "shape": "dag-edge",
          "attrs": {
            "line": {
              "stroke": "#7a3f59",
              "strokeWidth": 6,
              "strokeDasharray": ""
            }
          },
          "zIndex": 0,
          "id": "79727e41-f91a-42af-8610-bf695d1d5bab",
          "data": {
            "status": "STOPPED",
            "graphLock": false,
            "guid": "c88e20bc"
          },
          "parent": "group_490b7b77",
          "source": {
            "cell": "00798d3e-b188-4dec-a9bb-094552db721b",
            "port": "a7f6b04f-baa7-4a5e-901c-d41889514c80"
          },
          "target": {
            "cell": "dc4e22e5-a1fe-4d99-9f2b-01367e813b1b",
            "port": "91a87f00-4441-4857-8dae-dfc363367917"
          }
        }, {
          "shape": "dag-edge",
          "attrs": {
            "line": {
              "stroke": "#1acccf",
              "strokeWidth": 6,
              "strokeDasharray": ""
            }
          },
          "zIndex": 0,
          "id": "198f0bee-a079-4393-a218-eff672ec0e45",
          "data": {
            "status": "STOPPED",
            "graphLock": false,
            "guid": "14f3b8d0"
          },
          "parent": "group_490b7b77",
          "source": {
            "cell": "1f90147b-c49c-4884-803f-1c97f9824655",
            "port": "3419b89d-70be-479c-9877-75ce3bcfdf98"
          },
          "target": {
            "cell": "00798d3e-b188-4dec-a9bb-094552db721b",
            "port": "0551c2e5-658e-4cb4-ba93-19afc1f138d1"
          }
        }, {
          "shape": "dag-edge",
          "attrs": {
            "line": {
              "stroke": "#165b5c",
              "strokeWidth": 6,
              "strokeDasharray": ""
            }
          },
          "zIndex": 0,
          "id": "b46c8c19-0e51-48a0-8aca-c194b6478543",
          "data": {
            "status": "STOPPED",
            "graphLock": false,
            "guid": "fb78dabc"
          },
          "parent": "group_490b7b77",
          "source": {
            "cell": "8989a55c-1f87-404a-8135-58dab5225829",
            "port": "a3a0a2a0-48e1-41c1-93fa-21e92497380f"
          },
          "target": {
            "cell": "b4f890bc-3254-4e03-a4bb-7e16b8d5534d",
            "port": "b6e929c7-606a-477d-9de1-9c5751936aca"
          }
        }, {
          "shape": "dag-edge",
          "attrs": {
            "line": {
              "stroke": "#165b5c",
              "strokeWidth": 6,
              "strokeDasharray": ""
            }
          },
          "zIndex": 0,
          "id": "83b3763e-8da2-4e7e-ae9e-d57b4bc9c113",
          "data": {
            "status": "STOPPED",
            "graphLock": false,
            "guid": "e4af8da9"
          },
          "parent": "group_490b7b77",
          "source": {
            "cell": "45e063e4-8d3e-4e10-a1cd-48be2f78e97a",
            "port": "5c66b076-ef20-4c1e-8c41-683c8ba170b2"
          },
          "target": {
            "cell": "dc4e22e5-a1fe-4d99-9f2b-01367e813b1b",
            "port": "2712f986-c147-49dc-8f9a-ffd4a6f07f90"
          }
        }, {
          "shape": "dag-edge",
          "attrs": {
            "line": {
              "stroke": "#165b5c",
              "strokeWidth": 6,
              "strokeDasharray": ""
            }
          },
          "zIndex": 0,
          "id": "4c9746a9-80ec-49af-aeeb-68f273ee6346",
          "source": {
            "cell": "bbdd935f-f587-4db9-ad66-f32caec4d18b",
            "port": "a0ae4b81-5784-4661-b4d5-400266424ccd"
          },
          "target": {
            "cell": "3e41e3d3-2ef4-44fc-9771-d352e634dfdf",
            "port": "627134a1-328f-4aa2-8125-efef9f5b23ec"
          }
        }]
      },
      "environment": {
        "serviceIp": "localhost",
        "servicePort": "18080"
      },
      "project_id": "9560c0ea"
    },
  });
};

export default {
  'GET /api/params': getParams,
};
