// Modern ES6+ Refactored Script
(function() {
  'use strict';

  const $ = window.jQuery;
  if (!$) {
    console.error('jQuery is required but not loaded.');
    return;
  }

  // Configuration
  const CONFIG = {
    searchAnimDuration: 200,
    mobileNavAnimDuration: 200
  };

  // Search functionality
  const SearchModule = {
    $searchWrap: $('#search-form-wrap'),
    isAnimating: false,

    init() {
      $('.nav-search-btn').on('click', () => this.toggleSearch());
      $('.search-form-input').on('blur', () => this.hideSearch());
    },

    toggleSearch() {
      if (this.isAnimating) return;
      
      this.isAnimating = true;
      this.$searchWrap.addClass('on');
      
      setTimeout(() => {
        $('.search-form-input').focus();
        this.isAnimating = false;
      }, CONFIG.searchAnimDuration);
    },

    hideSearch() {
      this.isAnimating = true;
      this.$searchWrap.removeClass('on');
      
      setTimeout(() => {
        this.isAnimating = false;
      }, CONFIG.searchAnimDuration);
    }
  };

  // Share functionality
  const ShareModule = {
    init() {
      $('body')
        .on('click', () => this.closeAllBoxes())
        .on('click', '.article-share-link', (e) => this.handleShareClick(e))
        .on('click', '.article-share-box', (e) => e.stopPropagation())
        .on('click', '.article-share-box-input', function() {
          $(this).select();
        })
        .on('click', '.article-share-box-link', (e) => this.handleShareLinkClick(e));
    },

    closeAllBoxes() {
      $('.article-share-box.on').removeClass('on');
    },

    handleShareClick(e) {
      e.stopPropagation();
      
      const $link = $(e.currentTarget);
      const url = $link.data('url');
      const encodedUrl = encodeURIComponent(url);
      const title = $link.data('title');
      const id = `article-share-box-${$link.data('id')}`;
      const offset = $link.offset();

      let $box = $(`#${id}`);

      if ($box.length) {
        if ($box.hasClass('on')) {
          $box.removeClass('on');
          return;
        }
      } else {
        $box = this.createShareBox(id, url, encodedUrl, title);
        $('body').append($box);
      }

      $('.article-share-box.on').hide();
      $box.css({
        top: offset.top + 25,
        left: offset.left
      }).addClass('on');
    },

    createShareBox(id, url, encodedUrl, title) {
      const html = `
        <div id="${id}" class="article-share-box">
          <input class="article-share-input" value="${url}">
          <div class="article-share-links">
            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodedUrl}" 
               class="article-share-twitter" target="_blank" title="Twitter">
              <span class="fa fa-twitter"></span>
            </a>
            <a href="https://www.facebook.com/sharer.php?u=${encodedUrl}" 
               class="article-share-facebook" target="_blank" title="Facebook">
              <span class="fa fa-facebook"></span>
            </a>
            <a href="http://pinterest.com/pin/create/button/?url=${encodedUrl}" 
               class="article-share-pinterest" target="_blank" title="Pinterest">
              <span class="fa fa-pinterest"></span>
            </a>
            <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}" 
               class="article-share-linkedin" target="_blank" title="LinkedIn">
              <span class="fa fa-linkedin"></span>
            </a>
          </div>
        </div>
      `;
      return $(html);
    },

    handleShareLinkClick(e) {
      e.preventDefault();
      e.stopPropagation();
      window.open(e.currentTarget.href, `article-share-box-window-${Date.now()}`, 'width=500,height=450');
    }
  };

  // Caption functionality for images
  const CaptionModule = {
    init() {
      $('.article-entry').each((index, article) => {
        $(article).find('img').each((_, img) => {
          const $img = $(img);
          const $parent = $img.parent();
          
          if ($parent.hasClass('fancybox') || $parent.is('a')) return;

          const alt = img.alt;
          if (alt) {
            $img.after(`<span class="caption">${alt}</span>`);
          }
          $img.wrap(`<a href="${img.src}" data-fancybox="gallery" data-caption="${alt}"></a>`);
        });

        $(article).find('.fancybox').each(function() {
          $(this).attr('rel', `article${index}`);
        });
      });

      if ($.fancybox) {
        $('.fancybox').fancybox();
      }
    }
  };

  // Mobile navigation
  const MobileNavModule = {
    $container: $('#container'),
    isAnimating: false,

    init() {
      $('#main-nav-toggle').on('click', () => this.toggleNav());
      $('#wrap').on('click', () => this.closeNavIfOpen());
    },

    toggleNav() {
      if (this.isAnimating) return;
      
      this.isAnimating = true;
      this.$container.toggleClass('mobile-nav-on');
      
      setTimeout(() => {
        this.isAnimating = false;
      }, CONFIG.mobileNavAnimDuration);
    },

    closeNavIfOpen() {
      if (this.isAnimating || !this.$container.hasClass('mobile-nav-on')) return;
      this.$container.removeClass('mobile-nav-on');
    }
  };

  // Initialize all modules when DOM is ready
  $(document).ready(() => {
    SearchModule.init();
    ShareModule.init();
    CaptionModule.init();
    MobileNavModule.init();
  });
})();
