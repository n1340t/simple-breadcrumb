const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

const root = {
  type: 'dir',
  children: {
    home: {
      type: 'dir',
      children: {
        myname: {
          type: 'dir',
          children: {
            'filea.txt': {
              type: 'file',
            },
            'fileb.txt': {
              type: 'file',
            },
            projects: {
              type: 'dir',
              children: {
                mysupersecretproject: {
                  type: 'dir',
                  children: {
                    mysupersecretfile: {
                      type: 'file',
                    },
                  },
                },
              },
            },
            emptyDir1: {
              type: 'dir'
            },
            emptyDir2: {
              type: 'dir',
              children: {}
            },
            emptyDir3: {
              type: 'dir',
              children: null
            }
          },
        },
      },
    },
  },
};

app.get('/path/*', cors(), (req, res) => {
  let path = req.params['0'].replace(/\/$/, '');
  const names = path.split('/');
  let file = root.children;
  let isFileSearch = false;
  for (const name of names) {
    if (file[name]) {
      file = file[name];
      if (file.type === 'dir') {
        file = file.children;
      } else {
        file = {
          [`This is file ${name}`]: file,
        };
        isFileSearch = true;
        break;
      }
    }
  }
  const content = [];
  for (const entity in file) {
    content.push({
      name: entity,
      type: isFileSearch ? 'content' : file[entity].type,
    });
  }
  res.send(content);
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
