const ghpages = require('gh-pages')

ghpages.publish(
    'public',
    {
        branch: 'master',
        repo: 'git@github.com:Zifius/Zifius.github.io.git',
    },
    () => {
        console.info('\x1b[32m','Deploy Complete!')
    }
)