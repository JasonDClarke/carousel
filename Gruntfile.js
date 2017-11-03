module.exports = function(grunt) {

grunt.initConfig({
  watch: {
      css: {
        files: ['./*.scss'],
        tasks: ['sass:dist']
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
 }
})

grunt.loadNpmTasks('grunt-contrib-sass');
grunt.loadNpmTasks('grunt-contrib-watch');


grunt.registerTask('sas', ['sass']);
};
