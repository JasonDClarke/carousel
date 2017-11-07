module.exports = function(grunt) {

grunt.initConfig({
  watch: {
      css: {
        files: ['./*.scss', 'Carousel.js'],
        tasks: ['sass:dist', 'babel:dist', 'uglify', 'postcss']
      },
    },
  sass: {                              // Task
   dist: {                            // Target
     options: {                       // Target options
       style: 'expanded'
     },
     files: {                         // Dictionary of files
       'css/Carousel.css': 'Carousel.scss',
       'css/extraAnimations.css': 'extraAnimations.scss'     // 'destination': 'source'
     }
   }
 },
 uglify: {
    options: {
      mangle: true
    },
    my_target: {
      files: {
        'es5/Carousel.min.js': ['es5/Carousel.js']
      }
    }
 },
 babel: {
   options: {
     sourceMap: true,
     presets: ['env']
   },
   dist: {
     files: {
       'es5/Carousel.js': 'Carousel.js'
     }
   }
 },
 postcss: {
    options: {
      map: true, // inline sourcemaps
      processors: [
        require('autoprefixer')({browsers: 'last 2 versions'}) // add vendor prefixes
      ]
    },
    dist: {
      src: 'css/*.css'
    }
  }
})

grunt.loadNpmTasks('grunt-contrib-sass');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-babel')
grunt.loadNpmTasks('grunt-contrib-uglify')
grunt.loadNpmTasks('grunt-postcss');



grunt.registerTask('bab', ['babel']);
grunt.registerTask('sas', ['sass']);
};
