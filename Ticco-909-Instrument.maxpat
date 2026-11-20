{
  "patcher": {
    "fileversion": 1,
    "appversion": {
      "major": 8,
      "minor": 6,
      "revision": 0,
      "architecture": "x64",
      "modernui": 1
    },
    "classnamespace": "box",
    "rect": [
      65,
      85,
      1050,
      790
    ],
    "openinpresentation": 1,
    "devicewidth": 935.0,
    "boxes": [
      {
        "box": {
          "id": "obj-1",
          "maxclass": "newobj",
          "patching_rect": [
            365,
            87,
            80,
            22
          ],
          "text": "ticco909~"
        }
      },
      {
        "box": {
          "id": "obj-2",
          "maxclass": "newobj",
          "patching_rect": [
            20,
            20,
            50,
            22
          ],
          "text": "notein"
        }
      },
      {
        "box": {
          "id": "obj-3",
          "maxclass": "newobj",
          "patching_rect": [
            20,
            50,
            67,
            22
          ],
          "text": "pack 0 0"
        }
      },
      {
        "box": {
          "id": "obj-4",
          "maxclass": "newobj",
          "patching_rect": [
            20,
            84,
            84,
            22
          ],
          "text": "prepend note"
        }
      },
      {
        "box": {
          "id": "obj-5",
          "maxclass": "newobj",
          "patching_rect": [
            365,
            126,
            70,
            22
          ],
          "text": "plugout~"
        }
      },
      {
        "box": {
          "id": "obj-6",
          "maxclass": "comment",
          "patching_rect": [
            500,
            20,
            170,
            22
          ],
          "fontsize": 16.0,
          "fontface": 1,
          "text": "TICCO 909",
          "presentation": 1,
          "presentation_rect": [
            10,
            4,
            190,
            23
          ]
        }
      },
      {
        "box": {
          "id": "obj-7",
          "maxclass": "dropfile",
          "patching_rect": [
            500,
            74,
            130,
            32
          ],
          "presentation": 1,
          "presentation_rect": [
            819,
            117,
            100,
            31
          ]
        }
      },
      {
        "box": {
          "id": "obj-8",
          "maxclass": "comment",
          "patching_rect": [
            500,
            48,
            190,
            22
          ],
          "fontsize": 10.0,
          "text": "Drop extracted ROM here",
          "presentation": 1,
          "presentation_rect": [
            799,
            97,
            133,
            19
          ]
        }
      },
      {
        "box": {
          "id": "obj-9",
          "maxclass": "newobj",
          "patching_rect": [
            500,
            114,
            93,
            22
          ],
          "text": "prepend rom"
        }
      },
      {
        "box": {
          "id": "obj-10",
          "maxclass": "comment",
          "patching_rect": [
            10,
            153,
            74,
            22
          ],
          "fontsize": 11.0,
          "fontface": 1,
          "text": "Kick",
          "presentation": 1,
          "presentation_rect": [
            10,
            31,
            73,
            18
          ]
        }
      },
      {
        "box": {
          "id": "obj-11",
          "maxclass": "textbutton",
          "patching_rect": [
            10,
            624,
            59,
            18
          ],
          "mode": 0,
          "text": "Hit",
          "presentation": 1,
          "presentation_rect": [
            10,
            134,
            52,
            18
          ]
        }
      },
      {
        "box": {
          "id": "obj-12",
          "maxclass": "message",
          "patching_rect": [
            10,
            674,
            70,
            22
          ],
          "text": "note 36 100"
        }
      },
      {
        "box": {
          "id": "obj-13",
          "maxclass": "newobj",
          "patching_rect": [
            10,
            650,
            29,
            22
          ],
          "text": "t b"
        }
      },
      {
        "box": {
          "id": "obj-14",
          "maxclass": "live.dial",
          "patching_rect": [
            10,
            184,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "bd_tune",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "BD Tune",
              "parameter_shortname": "Tune",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.5
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            10,
            50,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-15",
          "maxclass": "newobj",
          "patching_rect": [
            10,
            232,
            150,
            22
          ],
          "text": "prepend control bd_tune"
        }
      },
      {
        "box": {
          "id": "obj-16",
          "maxclass": "live.dial",
          "patching_rect": [
            10,
            287,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "bd_level",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "BD Level",
              "parameter_shortname": "Level",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.75
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            45,
            50,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-17",
          "maxclass": "newobj",
          "patching_rect": [
            10,
            335,
            150,
            22
          ],
          "text": "prepend control bd_level"
        }
      },
      {
        "box": {
          "id": "obj-18",
          "maxclass": "live.dial",
          "patching_rect": [
            10,
            390,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "bd_attack",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "BD Attack",
              "parameter_shortname": "Attack",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.5
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            10,
            91,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-19",
          "maxclass": "newobj",
          "patching_rect": [
            10,
            438,
            150,
            22
          ],
          "text": "prepend control bd_attack"
        }
      },
      {
        "box": {
          "id": "obj-20",
          "maxclass": "live.dial",
          "patching_rect": [
            10,
            493,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "bd_decay",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "BD Decay",
              "parameter_shortname": "Decay",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.5
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            45,
            91,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-21",
          "maxclass": "newobj",
          "patching_rect": [
            10,
            541,
            150,
            22
          ],
          "text": "prepend control bd_decay"
        }
      },
      {
        "box": {
          "id": "obj-22",
          "maxclass": "comment",
          "patching_rect": [
            174,
            153,
            74,
            22
          ],
          "fontsize": 11.0,
          "fontface": 1,
          "text": "Snare",
          "presentation": 1,
          "presentation_rect": [
            86,
            31,
            73,
            18
          ]
        }
      },
      {
        "box": {
          "id": "obj-23",
          "maxclass": "textbutton",
          "patching_rect": [
            174,
            624,
            59,
            18
          ],
          "mode": 0,
          "text": "Hit",
          "presentation": 1,
          "presentation_rect": [
            86,
            134,
            52,
            18
          ]
        }
      },
      {
        "box": {
          "id": "obj-24",
          "maxclass": "message",
          "patching_rect": [
            174,
            674,
            70,
            22
          ],
          "text": "note 38 100"
        }
      },
      {
        "box": {
          "id": "obj-25",
          "maxclass": "newobj",
          "patching_rect": [
            174,
            650,
            29,
            22
          ],
          "text": "t b"
        }
      },
      {
        "box": {
          "id": "obj-26",
          "maxclass": "live.dial",
          "patching_rect": [
            174,
            184,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "sd_tune",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "SD Tune",
              "parameter_shortname": "Tune",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.5
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            86,
            50,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-27",
          "maxclass": "newobj",
          "patching_rect": [
            174,
            232,
            150,
            22
          ],
          "text": "prepend control sd_tune"
        }
      },
      {
        "box": {
          "id": "obj-28",
          "maxclass": "live.dial",
          "patching_rect": [
            174,
            287,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "sd_level",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "SD Level",
              "parameter_shortname": "Level",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.75
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            121,
            50,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-29",
          "maxclass": "newobj",
          "patching_rect": [
            174,
            335,
            150,
            22
          ],
          "text": "prepend control sd_level"
        }
      },
      {
        "box": {
          "id": "obj-30",
          "maxclass": "live.dial",
          "patching_rect": [
            174,
            390,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "sd_tone",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "SD Tone",
              "parameter_shortname": "Tone",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.5
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            86,
            91,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-31",
          "maxclass": "newobj",
          "patching_rect": [
            174,
            438,
            150,
            22
          ],
          "text": "prepend control sd_tone"
        }
      },
      {
        "box": {
          "id": "obj-32",
          "maxclass": "live.dial",
          "patching_rect": [
            174,
            493,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "sd_snappy",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "SD Snappy",
              "parameter_shortname": "Snappy",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.5
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            121,
            91,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-33",
          "maxclass": "newobj",
          "patching_rect": [
            174,
            541,
            150,
            22
          ],
          "text": "prepend control sd_snappy"
        }
      },
      {
        "box": {
          "id": "obj-34",
          "maxclass": "comment",
          "patching_rect": [
            338,
            153,
            74,
            22
          ],
          "fontsize": 11.0,
          "fontface": 1,
          "text": "Low Tom",
          "presentation": 1,
          "presentation_rect": [
            162,
            31,
            73,
            18
          ]
        }
      },
      {
        "box": {
          "id": "obj-35",
          "maxclass": "textbutton",
          "patching_rect": [
            338,
            624,
            59,
            18
          ],
          "mode": 0,
          "text": "Hit",
          "presentation": 1,
          "presentation_rect": [
            162,
            134,
            52,
            18
          ]
        }
      },
      {
        "box": {
          "id": "obj-36",
          "maxclass": "message",
          "patching_rect": [
            338,
            674,
            70,
            22
          ],
          "text": "note 43 100"
        }
      },
      {
        "box": {
          "id": "obj-37",
          "maxclass": "newobj",
          "patching_rect": [
            338,
            650,
            29,
            22
          ],
          "text": "t b"
        }
      },
      {
        "box": {
          "id": "obj-38",
          "maxclass": "live.dial",
          "patching_rect": [
            338,
            184,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "lt_tune",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "LT Tune",
              "parameter_shortname": "Tune",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.5
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            162,
            50,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-39",
          "maxclass": "newobj",
          "patching_rect": [
            338,
            232,
            150,
            22
          ],
          "text": "prepend control lt_tune"
        }
      },
      {
        "box": {
          "id": "obj-40",
          "maxclass": "live.dial",
          "patching_rect": [
            338,
            287,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "lt_level",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "LT Level",
              "parameter_shortname": "Level",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.75
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            197,
            50,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-41",
          "maxclass": "newobj",
          "patching_rect": [
            338,
            335,
            150,
            22
          ],
          "text": "prepend control lt_level"
        }
      },
      {
        "box": {
          "id": "obj-42",
          "maxclass": "live.dial",
          "patching_rect": [
            338,
            390,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "lt_decay",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "LT Decay",
              "parameter_shortname": "Decay",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.5
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            162,
            91,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-43",
          "maxclass": "newobj",
          "patching_rect": [
            338,
            438,
            150,
            22
          ],
          "text": "prepend control lt_decay"
        }
      },
      {
        "box": {
          "id": "obj-44",
          "maxclass": "comment",
          "patching_rect": [
            502,
            153,
            74,
            22
          ],
          "fontsize": 11.0,
          "fontface": 1,
          "text": "Mid Tom",
          "presentation": 1,
          "presentation_rect": [
            238,
            31,
            73,
            18
          ]
        }
      },
      {
        "box": {
          "id": "obj-45",
          "maxclass": "textbutton",
          "patching_rect": [
            502,
            624,
            59,
            18
          ],
          "mode": 0,
          "text": "Hit",
          "presentation": 1,
          "presentation_rect": [
            238,
            134,
            52,
            18
          ]
        }
      },
      {
        "box": {
          "id": "obj-46",
          "maxclass": "message",
          "patching_rect": [
            502,
            674,
            70,
            22
          ],
          "text": "note 47 100"
        }
      },
      {
        "box": {
          "id": "obj-47",
          "maxclass": "newobj",
          "patching_rect": [
            502,
            650,
            29,
            22
          ],
          "text": "t b"
        }
      },
      {
        "box": {
          "id": "obj-48",
          "maxclass": "live.dial",
          "patching_rect": [
            502,
            184,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "mt_tune",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "MT Tune",
              "parameter_shortname": "Tune",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.5
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            238,
            50,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-49",
          "maxclass": "newobj",
          "patching_rect": [
            502,
            232,
            150,
            22
          ],
          "text": "prepend control mt_tune"
        }
      },
      {
        "box": {
          "id": "obj-50",
          "maxclass": "live.dial",
          "patching_rect": [
            502,
            287,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "mt_level",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "MT Level",
              "parameter_shortname": "Level",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.75
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            273,
            50,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-51",
          "maxclass": "newobj",
          "patching_rect": [
            502,
            335,
            150,
            22
          ],
          "text": "prepend control mt_level"
        }
      },
      {
        "box": {
          "id": "obj-52",
          "maxclass": "live.dial",
          "patching_rect": [
            502,
            390,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "mt_decay",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "MT Decay",
              "parameter_shortname": "Decay",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.5
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            238,
            91,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-53",
          "maxclass": "newobj",
          "patching_rect": [
            502,
            438,
            150,
            22
          ],
          "text": "prepend control mt_decay"
        }
      },
      {
        "box": {
          "id": "obj-54",
          "maxclass": "comment",
          "patching_rect": [
            666,
            153,
            74,
            22
          ],
          "fontsize": 11.0,
          "fontface": 1,
          "text": "High Tom",
          "presentation": 1,
          "presentation_rect": [
            314,
            31,
            73,
            18
          ]
        }
      },
      {
        "box": {
          "id": "obj-55",
          "maxclass": "textbutton",
          "patching_rect": [
            666,
            624,
            59,
            18
          ],
          "mode": 0,
          "text": "Hit",
          "presentation": 1,
          "presentation_rect": [
            314,
            134,
            52,
            18
          ]
        }
      },
      {
        "box": {
          "id": "obj-56",
          "maxclass": "message",
          "patching_rect": [
            666,
            674,
            70,
            22
          ],
          "text": "note 50 100"
        }
      },
      {
        "box": {
          "id": "obj-57",
          "maxclass": "newobj",
          "patching_rect": [
            666,
            650,
            29,
            22
          ],
          "text": "t b"
        }
      },
      {
        "box": {
          "id": "obj-58",
          "maxclass": "live.dial",
          "patching_rect": [
            666,
            184,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "ht_tune",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "HT Tune",
              "parameter_shortname": "Tune",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.5
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            314,
            50,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-59",
          "maxclass": "newobj",
          "patching_rect": [
            666,
            232,
            150,
            22
          ],
          "text": "prepend control ht_tune"
        }
      },
      {
        "box": {
          "id": "obj-60",
          "maxclass": "live.dial",
          "patching_rect": [
            666,
            287,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "ht_level",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "HT Level",
              "parameter_shortname": "Level",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.75
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            349,
            50,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-61",
          "maxclass": "newobj",
          "patching_rect": [
            666,
            335,
            150,
            22
          ],
          "text": "prepend control ht_level"
        }
      },
      {
        "box": {
          "id": "obj-62",
          "maxclass": "live.dial",
          "patching_rect": [
            666,
            390,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "ht_decay",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "HT Decay",
              "parameter_shortname": "Decay",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.5
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            314,
            91,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-63",
          "maxclass": "newobj",
          "patching_rect": [
            666,
            438,
            150,
            22
          ],
          "text": "prepend control ht_decay"
        }
      },
      {
        "box": {
          "id": "obj-64",
          "maxclass": "comment",
          "patching_rect": [
            830,
            153,
            74,
            22
          ],
          "fontsize": 11.0,
          "fontface": 1,
          "text": "Rim",
          "presentation": 1,
          "presentation_rect": [
            390,
            31,
            73,
            18
          ]
        }
      },
      {
        "box": {
          "id": "obj-65",
          "maxclass": "textbutton",
          "patching_rect": [
            830,
            624,
            59,
            18
          ],
          "mode": 0,
          "text": "Hit",
          "presentation": 1,
          "presentation_rect": [
            390,
            134,
            52,
            18
          ]
        }
      },
      {
        "box": {
          "id": "obj-66",
          "maxclass": "message",
          "patching_rect": [
            830,
            674,
            70,
            22
          ],
          "text": "note 37 100"
        }
      },
      {
        "box": {
          "id": "obj-67",
          "maxclass": "newobj",
          "patching_rect": [
            830,
            650,
            29,
            22
          ],
          "text": "t b"
        }
      },
      {
        "box": {
          "id": "obj-68",
          "maxclass": "live.dial",
          "patching_rect": [
            830,
            184,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "rs_level",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "RS Level",
              "parameter_shortname": "Level",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.75
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            390,
            50,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-69",
          "maxclass": "newobj",
          "patching_rect": [
            830,
            232,
            150,
            22
          ],
          "text": "prepend control rs_level"
        }
      },
      {
        "box": {
          "id": "obj-70",
          "maxclass": "comment",
          "patching_rect": [
            994,
            153,
            74,
            22
          ],
          "fontsize": 11.0,
          "fontface": 1,
          "text": "Clap",
          "presentation": 1,
          "presentation_rect": [
            466,
            31,
            73,
            18
          ]
        }
      },
      {
        "box": {
          "id": "obj-71",
          "maxclass": "textbutton",
          "patching_rect": [
            994,
            624,
            59,
            18
          ],
          "mode": 0,
          "text": "Hit",
          "presentation": 1,
          "presentation_rect": [
            466,
            134,
            52,
            18
          ]
        }
      },
      {
        "box": {
          "id": "obj-72",
          "maxclass": "message",
          "patching_rect": [
            994,
            674,
            70,
            22
          ],
          "text": "note 39 100"
        }
      },
      {
        "box": {
          "id": "obj-73",
          "maxclass": "newobj",
          "patching_rect": [
            994,
            650,
            29,
            22
          ],
          "text": "t b"
        }
      },
      {
        "box": {
          "id": "obj-74",
          "maxclass": "live.dial",
          "patching_rect": [
            994,
            184,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "hc_level",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "HC Level",
              "parameter_shortname": "Level",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.75
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            466,
            50,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-75",
          "maxclass": "newobj",
          "patching_rect": [
            994,
            232,
            150,
            22
          ],
          "text": "prepend control hc_level"
        }
      },
      {
        "box": {
          "id": "obj-76",
          "maxclass": "comment",
          "patching_rect": [
            1158,
            153,
            74,
            22
          ],
          "fontsize": 11.0,
          "fontface": 1,
          "text": "Hi-Hat",
          "presentation": 1,
          "presentation_rect": [
            542,
            31,
            73,
            18
          ]
        }
      },
      {
        "box": {
          "id": "obj-77",
          "maxclass": "textbutton",
          "patching_rect": [
            1158,
            624,
            59,
            18
          ],
          "mode": 0,
          "text": "Hit",
          "presentation": 1,
          "presentation_rect": [
            542,
            134,
            24,
            18
          ]
        }
      },
      {
        "box": {
          "id": "obj-78",
          "maxclass": "message",
          "patching_rect": [
            1158,
            674,
            70,
            22
          ],
          "text": "note 42 100"
        }
      },
      {
        "box": {
          "id": "obj-79",
          "maxclass": "newobj",
          "patching_rect": [
            1158,
            650,
            29,
            22
          ],
          "text": "t b"
        }
      },
      {
        "box": {
          "id": "obj-80",
          "maxclass": "textbutton",
          "patching_rect": [
            1158,
            706,
            42,
            18
          ],
          "mode": 0,
          "text": "OH",
          "presentation": 1,
          "presentation_rect": [
            569,
            134,
            24,
            18
          ]
        }
      },
      {
        "box": {
          "id": "obj-81",
          "maxclass": "message",
          "patching_rect": [
            1158,
            756,
            72,
            22
          ],
          "text": "note 46 100"
        }
      },
      {
        "box": {
          "id": "obj-82",
          "maxclass": "newobj",
          "patching_rect": [
            1158,
            731,
            29,
            22
          ],
          "text": "t b"
        }
      },
      {
        "box": {
          "id": "obj-83",
          "maxclass": "live.dial",
          "patching_rect": [
            1158,
            184,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "hh_level",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "HH Level",
              "parameter_shortname": "Level",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.75
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            542,
            50,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-84",
          "maxclass": "newobj",
          "patching_rect": [
            1158,
            232,
            150,
            22
          ],
          "text": "prepend control hh_level"
        }
      },
      {
        "box": {
          "id": "obj-85",
          "maxclass": "live.dial",
          "patching_rect": [
            1158,
            287,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "ch_decay",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "CH Decay",
              "parameter_shortname": "CH Dec",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.5
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            577,
            50,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-86",
          "maxclass": "newobj",
          "patching_rect": [
            1158,
            335,
            150,
            22
          ],
          "text": "prepend control ch_decay"
        }
      },
      {
        "box": {
          "id": "obj-87",
          "maxclass": "live.dial",
          "patching_rect": [
            1158,
            390,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "oh_decay",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "OH Decay",
              "parameter_shortname": "OH Dec",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.5
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            542,
            91,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-88",
          "maxclass": "newobj",
          "patching_rect": [
            1158,
            438,
            150,
            22
          ],
          "text": "prepend control oh_decay"
        }
      },
      {
        "box": {
          "id": "obj-89",
          "maxclass": "comment",
          "patching_rect": [
            1322,
            153,
            74,
            22
          ],
          "fontsize": 11.0,
          "fontface": 1,
          "text": "Crash",
          "presentation": 1,
          "presentation_rect": [
            618,
            31,
            73,
            18
          ]
        }
      },
      {
        "box": {
          "id": "obj-90",
          "maxclass": "textbutton",
          "patching_rect": [
            1322,
            624,
            59,
            18
          ],
          "mode": 0,
          "text": "Hit",
          "presentation": 1,
          "presentation_rect": [
            618,
            134,
            52,
            18
          ]
        }
      },
      {
        "box": {
          "id": "obj-91",
          "maxclass": "message",
          "patching_rect": [
            1322,
            674,
            70,
            22
          ],
          "text": "note 49 100"
        }
      },
      {
        "box": {
          "id": "obj-92",
          "maxclass": "newobj",
          "patching_rect": [
            1322,
            650,
            29,
            22
          ],
          "text": "t b"
        }
      },
      {
        "box": {
          "id": "obj-93",
          "maxclass": "live.dial",
          "patching_rect": [
            1322,
            184,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "cr_level",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "Crash Level",
              "parameter_shortname": "Level",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.75
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            618,
            50,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-94",
          "maxclass": "newobj",
          "patching_rect": [
            1322,
            232,
            150,
            22
          ],
          "text": "prepend control cr_level"
        }
      },
      {
        "box": {
          "id": "obj-95",
          "maxclass": "live.dial",
          "patching_rect": [
            1322,
            287,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "cr_tune",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "Crash Tune",
              "parameter_shortname": "Tune",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.5
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            653,
            50,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-96",
          "maxclass": "newobj",
          "patching_rect": [
            1322,
            335,
            150,
            22
          ],
          "text": "prepend control cr_tune"
        }
      },
      {
        "box": {
          "id": "obj-97",
          "maxclass": "comment",
          "patching_rect": [
            1486,
            153,
            74,
            22
          ],
          "fontsize": 11.0,
          "fontface": 1,
          "text": "Ride",
          "presentation": 1,
          "presentation_rect": [
            694,
            31,
            73,
            18
          ]
        }
      },
      {
        "box": {
          "id": "obj-98",
          "maxclass": "textbutton",
          "patching_rect": [
            1486,
            624,
            59,
            18
          ],
          "mode": 0,
          "text": "Hit",
          "presentation": 1,
          "presentation_rect": [
            694,
            134,
            52,
            18
          ]
        }
      },
      {
        "box": {
          "id": "obj-99",
          "maxclass": "message",
          "patching_rect": [
            1486,
            674,
            70,
            22
          ],
          "text": "note 51 100"
        }
      },
      {
        "box": {
          "id": "obj-100",
          "maxclass": "newobj",
          "patching_rect": [
            1486,
            650,
            29,
            22
          ],
          "text": "t b"
        }
      },
      {
        "box": {
          "id": "obj-101",
          "maxclass": "live.dial",
          "patching_rect": [
            1486,
            184,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "rd_level",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "Ride Level",
              "parameter_shortname": "Level",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.75
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            694,
            50,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-102",
          "maxclass": "newobj",
          "patching_rect": [
            1486,
            232,
            150,
            22
          ],
          "text": "prepend control rd_level"
        }
      },
      {
        "box": {
          "id": "obj-103",
          "maxclass": "live.dial",
          "patching_rect": [
            1486,
            287,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "rd_tune",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "Ride Tune",
              "parameter_shortname": "Tune",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.5
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            729,
            50,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-104",
          "maxclass": "newobj",
          "patching_rect": [
            1486,
            335,
            150,
            22
          ],
          "text": "prepend control rd_tune"
        }
      },
      {
        "box": {
          "id": "obj-105",
          "maxclass": "comment",
          "patching_rect": [
            1650,
            153,
            74,
            22
          ],
          "fontsize": 11.0,
          "fontface": 1,
          "text": "Master",
          "presentation": 1,
          "presentation_rect": [
            770,
            31,
            73,
            18
          ]
        }
      },
      {
        "box": {
          "id": "obj-106",
          "maxclass": "live.dial",
          "patching_rect": [
            1650,
            184,
            42,
            44
          ],
          "parameter_enable": 1,
          "varname": "volume",
          "showname": 1,
          "shownumber": 0,
          "saved_attribute_attributes": {
            "valueof": {
              "parameter_longname": "Master Volume",
              "parameter_shortname": "Volume",
              "parameter_mmin": 0.0,
              "parameter_mmax": 1.0,
              "parameter_initial_enable": 1,
              "parameter_initial": [
                0.7
              ],
              "parameter_type": 0,
              "parameter_unitstyle": 1
            }
          },
          "presentation": 1,
          "presentation_rect": [
            770,
            50,
            35,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-107",
          "maxclass": "newobj",
          "patching_rect": [
            1650,
            232,
            150,
            22
          ],
          "text": "prepend control volume"
        }
      }
    ],
    "lines": [
      {
        "patchline": {
          "source": [
            "obj-2",
            1
          ],
          "destination": [
            "obj-3",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-2",
            0
          ],
          "destination": [
            "obj-3",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-3",
            0
          ],
          "destination": [
            "obj-4",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-4",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-1",
            0
          ],
          "destination": [
            "obj-5",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-1",
            1
          ],
          "destination": [
            "obj-5",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-7",
            0
          ],
          "destination": [
            "obj-9",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-9",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-11",
            1
          ],
          "destination": [
            "obj-13",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-13",
            0
          ],
          "destination": [
            "obj-12",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-12",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-14",
            0
          ],
          "destination": [
            "obj-15",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-15",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-16",
            0
          ],
          "destination": [
            "obj-17",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-17",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-18",
            0
          ],
          "destination": [
            "obj-19",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-19",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-20",
            0
          ],
          "destination": [
            "obj-21",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-21",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-23",
            1
          ],
          "destination": [
            "obj-25",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-25",
            0
          ],
          "destination": [
            "obj-24",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-24",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-26",
            0
          ],
          "destination": [
            "obj-27",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-27",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-28",
            0
          ],
          "destination": [
            "obj-29",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-29",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-30",
            0
          ],
          "destination": [
            "obj-31",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-31",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-32",
            0
          ],
          "destination": [
            "obj-33",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-33",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-35",
            1
          ],
          "destination": [
            "obj-37",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-37",
            0
          ],
          "destination": [
            "obj-36",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-36",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-38",
            0
          ],
          "destination": [
            "obj-39",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-39",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-40",
            0
          ],
          "destination": [
            "obj-41",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-41",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-42",
            0
          ],
          "destination": [
            "obj-43",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-43",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-45",
            1
          ],
          "destination": [
            "obj-47",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-47",
            0
          ],
          "destination": [
            "obj-46",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-46",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-48",
            0
          ],
          "destination": [
            "obj-49",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-49",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-50",
            0
          ],
          "destination": [
            "obj-51",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-51",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-52",
            0
          ],
          "destination": [
            "obj-53",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-53",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-55",
            1
          ],
          "destination": [
            "obj-57",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-57",
            0
          ],
          "destination": [
            "obj-56",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-56",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-58",
            0
          ],
          "destination": [
            "obj-59",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-59",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-60",
            0
          ],
          "destination": [
            "obj-61",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-61",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-62",
            0
          ],
          "destination": [
            "obj-63",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-63",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-65",
            1
          ],
          "destination": [
            "obj-67",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-67",
            0
          ],
          "destination": [
            "obj-66",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-66",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-68",
            0
          ],
          "destination": [
            "obj-69",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-69",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-71",
            1
          ],
          "destination": [
            "obj-73",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-73",
            0
          ],
          "destination": [
            "obj-72",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-72",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-74",
            0
          ],
          "destination": [
            "obj-75",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-75",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-77",
            1
          ],
          "destination": [
            "obj-79",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-79",
            0
          ],
          "destination": [
            "obj-78",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-78",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-80",
            1
          ],
          "destination": [
            "obj-82",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-82",
            0
          ],
          "destination": [
            "obj-81",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-81",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-83",
            0
          ],
          "destination": [
            "obj-84",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-84",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-85",
            0
          ],
          "destination": [
            "obj-86",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-86",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-87",
            0
          ],
          "destination": [
            "obj-88",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-88",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-90",
            1
          ],
          "destination": [
            "obj-92",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-92",
            0
          ],
          "destination": [
            "obj-91",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-91",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-93",
            0
          ],
          "destination": [
            "obj-94",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-94",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-95",
            0
          ],
          "destination": [
            "obj-96",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-96",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-98",
            1
          ],
          "destination": [
            "obj-100",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-100",
            0
          ],
          "destination": [
            "obj-99",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-99",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-101",
            0
          ],
          "destination": [
            "obj-102",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-102",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-103",
            0
          ],
          "destination": [
            "obj-104",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-104",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-106",
            0
          ],
          "destination": [
            "obj-107",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-107",
            0
          ],
          "destination": [
            "obj-1",
            0
          ]
        }
      }
    ],
    "parameters": {
      "obj-14": [
        "BD Tune",
        "Tune",
        0
      ],
      "obj-16": [
        "BD Level",
        "Level",
        0
      ],
      "obj-18": [
        "BD Attack",
        "Attack",
        0
      ],
      "obj-20": [
        "BD Decay",
        "Decay",
        0
      ],
      "obj-26": [
        "SD Tune",
        "Tune",
        0
      ],
      "obj-28": [
        "SD Level",
        "Level",
        0
      ],
      "obj-30": [
        "SD Tone",
        "Tone",
        0
      ],
      "obj-32": [
        "SD Snappy",
        "Snappy",
        0
      ],
      "obj-38": [
        "LT Tune",
        "Tune",
        0
      ],
      "obj-40": [
        "LT Level",
        "Level",
        0
      ],
      "obj-42": [
        "LT Decay",
        "Decay",
        0
      ],
      "obj-48": [
        "MT Tune",
        "Tune",
        0
      ],
      "obj-50": [
        "MT Level",
        "Level",
        0
      ],
      "obj-52": [
        "MT Decay",
        "Decay",
        0
      ],
      "obj-58": [
        "HT Tune",
        "Tune",
        0
      ],
      "obj-60": [
        "HT Level",
        "Level",
        0
      ],
      "obj-62": [
        "HT Decay",
        "Decay",
        0
      ],
      "obj-68": [
        "RS Level",
        "Level",
        0
      ],
      "obj-74": [
        "HC Level",
        "Level",
        0
      ],
      "obj-83": [
        "HH Level",
        "Level",
        0
      ],
      "obj-85": [
        "CH Decay",
        "CH Dec",
        0
      ],
      "obj-87": [
        "OH Decay",
        "OH Dec",
        0
      ],
      "obj-93": [
        "Crash Level",
        "Level",
        0
      ],
      "obj-95": [
        "Crash Tune",
        "Tune",
        0
      ],
      "obj-101": [
        "Ride Level",
        "Level",
        0
      ],
      "obj-103": [
        "Ride Tune",
        "Tune",
        0
      ],
      "obj-106": [
        "Master Volume",
        "Volume",
        0
      ]
    }
  }
}
