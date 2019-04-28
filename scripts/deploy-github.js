const ghpages = require('gh-pages')

// replace with your repo url
ghpages.publish(
    'public',
    {
        branch: 'master',
        repo: 'git@github.com:Zifius/Zifius.github.io.git',
    },
    () => {
        console.info('Deploy Complete!')
    }
)