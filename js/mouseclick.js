(function() {
  let a_idx = 0;
  let scripts = document.getElementsByTagName("script");
  let script = Array.from(scripts).filter(script =>
    script.getAttribute("src") &&
    script.getAttribute("src").indexOf("mouseclick.js") > -1 &&
    script.getAttribute("content"))[0];
  let a = script.getAttribute("content").split(",");
  let f_colors = script.getAttribute("color").split(",");

  jQuery(document).ready(function($) {
    $("body").click(function(e) {
      let $i = $("<span/>").text(a[a_idx]);

      a_idx = (a_idx + 1) % a.length;
      let x = e.pageX,
        y = e.pageY;
      $i.css({
        "z-index": 100000000,
        "top": y - 20,
        "left": x,
        "position": "absolute",
        "font-weight": "bold",
        "color": f_colors[a_idx]
      });

      $("body").append($i);

      $i.animate({
        "top": y - 180,
        "opacity": 0
      }, 2000, function() {
        $i.remove();
      });
    });
  });

  hexo.extend.helper.register('related_posts', function(currentPost, allPosts){
  var relatedPosts = [];
  currentPost.tags.forEach(function (tag) {
      allPosts.forEach(function (post) {
          if (isTagRelated(tag.name, post.tags)) {
              var relatedPost = {
                  title: post.title,
                  path: post.path,
                  weight: 1
              };

              var index = findItem(relatedPosts, 'path', post.path);

              if (index != -1) {
                  relatedPosts[index].weight += 1;
              } else{
                  if (currentPost.path != post.path) {
                      relatedPosts.push(relatedPost);
                  };
              };
          };
      });
  });

  if (relatedPosts.length == 0) {return ''};

  var result = '<h3>相关文章：</h3><ul class="related-posts">';
  relatedPosts = relatedPosts.sort(compare('weight'));
  for (var i = 0; i < Math.min(relatedPosts.length, 10); i++) {
      result += '<li><a href="/' + relatedPosts[i].path + '">' + relatedPosts[i].title + '</a></li>';
  };
  result += '</ul>';

  // console.log(relatedPosts);
  return result;
});

function isTagRelated (tagName, TBDtags) {
  var result = false;
  TBDtags.forEach(function (tag) {
      if (tagName == tag.name) {
          result = true;
      };
  })

  return result;
}

function findItem (arrayToSearch, attr, val) {
  for (var i = 0; i < arrayToSearch.length; i++) {
      if (arrayToSearch[i][attr] == val) {
          return i
      };
  };

  return -1;
}

function compare (attr) {
  return function (a, b) {
      var val1 = a[attr];
      var val2 = b[attr];
      return val2 - val1;
  }
}
})()