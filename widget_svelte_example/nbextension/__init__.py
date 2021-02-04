#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Alex Cabrera
# Distributed under the terms of the Modified BSD License.

def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'nbextension/static',
        'dest': 'widget_svelte_example',
        'require': 'widget_svelte_example/extension'
    }]
