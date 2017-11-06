module.exports = function(grunt) {

grunt.initConfig({
  watch: {
      css: {
        files: ['./*.scss', 'Carousel.js'],
        tasks: ['sass:dist', 'babel:dist']
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
 }
})

grunt.loadNpmTasks('grunt-contrib-sass');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-babel')




grunt.registerTask('bab', ['babel']);
grunt.registerTask('sas', ['sass']);
};
