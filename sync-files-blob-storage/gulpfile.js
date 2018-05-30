var gulp = require('gulp');
var deployCdn = require('gulp-deploy-azure-cdn');
var argv = require('yargs').argv;


gulp.task('watch-files', () => {
    var connectionString = argv.storageConnectionString;
    console.log(`argv.watch=${argv.watch}`);
    var watcher = gulp.watch(argv.watch || '*.jpg', function(e) {
        if(e.type === 'added') {
            console.log(e.path);
            return gulp.src(e.path, {
                base: './' // the base directory in which the file is located. The relative path of file to this directory is used as the destination path 
            }).pipe(deployCdn({
                containerName: 'public', // container name in blob 
                serviceOptions: [connectionString],
                folder: getFolderName(), // path within container 
                zip: false, // gzip files if they become smaller after zipping, content-encoding header will change if file is zipped 
                deleteExistingBlobs: false, // true means recursively deleting anything under folder 
                concurrentUploadThreads: 1, // number of concurrent uploads, choose best for your network condition 
                metadata: {
                    cacheControl: 'public, max-age=31530000', // cache in browser 
                    cacheControlHeader: 'public, max-age=31530000' // cache in azure CDN. As this data does not change, we set it to 1 year 
                },
                testRun: false // test run - means no blobs will be actually deleted or uploaded, see log messages for details 
            })).on('error', console.log);
        }
    });
});


function getFolderName() {
    var today = new Date();
    return `${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`;
}