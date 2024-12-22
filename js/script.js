/* eslint-disable no-unused-vars */
/* eslint-disable no-inner-declarations */
//document.getElementById('test-button').addEventListener('click', function(){
//const links = document.querySelectorAll('.titles a');
//console.log('links:', links);
// });
{
  'use strict';

  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud').innerHTML),
    authorsList: Handlebars.compile(document.querySelector('#template-authors-list').innerHTML),
  };

  const opts = {
    all: {
      articles: '.post',
    },
    titleSelector: '.post-title',
    tagSizes: {
      count: 5,
      classPrefix: 'tag-size-',
    },
    article: {
      tags: '.post-tags .list',
      authors: '.post-author',
    },
    listOf: {
      titles: '.titles',
      tags: '.tags.list',
      authors: '.list.authors',
    },
  };

  function titleClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;
    // console.log('Link was clicked!');
    // console.log(event);
    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }

    /* [IN PROGRESS] add class 'active' to the clicked link */
    // console.log('clickedElement:', clickedElement);
    clickedElement.classList.add('active');

    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.post.active');

    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }
    /* get 'href' attribute from the clicked link */
    const elementAttr = clickedElement.getAttribute('href');
    // console.log('Atrybut href dla klikniętego elementu to ' + elementAttr);

    /* find the correct article using the selector (value of 'href' attribute) */
    let showArticle = document.querySelector(elementAttr);
    // console.log('Artykuł do pokazania to ' + showArticle);
    /* add class 'active' to the correct article */
    showArticle.classList.add('active');
  }


  // Titles list generator

  function generateTitleLinks(customSelector = '') {
    // console.log('Clear titles sidebar section');
    // console.log(customSelector);
    // console.log(opts.all.articles + customSelector);
    /* remove contents of titleList */
    const titleList = document.querySelector(opts.listOf.titles);
    titleList.innerHTML = '';

    let html = '';

    /* for each article */
    const articles = document.querySelectorAll(opts.all.articles + customSelector);
    for (let article of articles) {
      /* get the article id */
      const articleId = article.getAttribute('id');

      /* find the title element */
      const articleTitle = article.querySelector(opts.titleSelector).innerHTML;
      /* get the title from the title element */

      /* create HTML of the link */
      // const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
      const linkHTMLData = { id: articleId, title: articleTitle };
      const linkHTML = templates.articleLink(linkHTMLData);
      // console.log(linkHTML);
      /* insert link into titleList */
      html = html + linkHTML;
      // titleList.innerHTML = titleList.innerHTML + linkHTML;
      // console.log(html);
    }
    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');

    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  }

  generateTitleLinks();

  function calculateTagsParams(tags) {
    const params = { max: 0, min: 999999 };
    for (let tag in tags) {
      if (tags[tag] > params.max) {
        params.max = tags[tag];
      }
      if (tags[tag] < params.min) {
        params.min = tags[tag];
      }
      // console.log(tag + ' is used ' + tags[tag] + ' times');
    }
    return params;
    // console.log(params);
  }

  function calculateTagClass(count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    // console.log(percentage);
    const classNumber = Math.floor(percentage * (opts.tagSizes.count - 1) + 1);
    // console.log(classNumber);

    return opts.tagSizes.classPrefix + classNumber;

    // const tagClassName = opts.tagSizes.classPrefix + opts.tagSizes.count;
    // console.log(tagClassName);
  }

  function generateTags() {
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};
    // console.log(allTags);
    /* find all articles */
    const articles = document.querySelectorAll(opts.all.articles);
    /* START LOOP: for every article: */
    for (let article of articles) {
      /* find tags wrapper */
      const tagsWrapper = article.querySelector(opts.article.tags);
      // console.log(tagsWrapper);
      /* make html variable with empty string */
      let html = '';
      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');
      // console.log(articleTags);
      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
      // console.log(articleTagsArray);
      /* START LOOP: for each tag */
      for (let tag of articleTagsArray) {
        // console.log('nazwa tagu to ' + tag);
        /* generate HTML of the link */
        // const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
        const linkHTMLData = { id: tag, title: tag };
        const linkHTML = templates.tagLink(linkHTMLData);
        // console.log(linkHTML);
        /* add generated code to html variable */
        html = html + linkHTML;
        // console.log(html);
        /* [NEW] check if this link is NOT already in allTags */
        if (!allTags.hasOwnProperty(tag)) {
          /* [NEW] add generated code to allTags object */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
        /* END LOOP: for each tag */
      }
      /* insert HTML of all the links into the tags wrapper */
      tagsWrapper.innerHTML = html;
      /* END LOOP: for every article: */
      /* [NEW] find list of tags in right column */
      const tagList = document.querySelector(opts.listOf.tags);
      /* [NEW] add html from allTags to tagList */
      // tagList.innerHTML = allTags.join(' ');
      // console.log(allTags);
      /*create variable for all links HTML code*/
      const tagsParams = calculateTagsParams(allTags);
      // console.log('tagsParams', tagsParams);
      // let allTagsHTML = '';
      const allTagsData = { tags: [] };
      // START loop for each tag in allTags
      for (let tag in allTags) {
        // generate code of a link and add it to allTagsHTML
        // allTagsHTML += '<a href="#tag-'+ tag +'">' + tag + ' ('+ allTags[tag] +') </a>';
        // const tagLinkHTML = '<li><a href="#tag-'+ tag +'" class="'+ calculateTagClass(allTags[tag], tagsParams) +'">' + tag + '</a></li>';
        // console.log('tagLinkHTML: ', tagLinkHTML);
        // allTagsHTML += '<li><a href="#tag-'+ tag +'" class="'+ tagLinkHTML +'">' + tag + ' ('+ allTags[tag] +')' + '</a></li>';
        // allTagsHTML += tagLinkHTML;
        // console.log(allTagsHTML);
        // console.log(tag);
        // console.log(allTags[tag]);
        allTagsData.tags.push({
          tag: tag,
          count: allTags[tag],
          className: calculateTagClass(allTags[tag], tagsParams)
        });
      }

      // add html from allTagsHTML to tagList
      tagList.innerHTML = templates.tagCloudLink(allTagsData);
      // console.log(allTagsData);
    }
  }

  generateTags();

  function tagClickHandler(event) {
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    // console.log('Tag został kliknięty');
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    /* find all tag links with class active */
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    /* START LOOP: for each active tag link */
    for (let activeTagLink of activeTagLinks) {
      /* remove class active */
      activeTagLink.classList.remove('active');
      /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const sameTags = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for (let sameTag of sameTags) {
      /* add class active */
      // console.log(sameTag);
      sameTag.classList.add('active');
      /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }

  function addClickListenersToTags() {
    /* find all links to tags */
    const tagLinks = document.querySelectorAll('.post-tags .list a, .tags a');
    /* START LOOP: for each link */
    for (let tagLink of tagLinks) {
      /* add tagClickHandler as event listener for that link */
      tagLink.addEventListener('click', tagClickHandler);
      /* END LOOP: for each link */
    }
  }

  addClickListenersToTags();

  //START of generateAuthors function-
  // Find all articles-
  // Start loop for every article-
  // Find author wrapper-
  // make html variable as empty string-
  // get author name from data-author-
  // generate html of the author links-
  // add generated code to html variable-
  // insert html of all author links into author tag wrapper
  // End loop
  function generateAuthors() {
    let allAuthors = {};
    const articles = document.querySelectorAll(opts.all.articles);
    // console.log(articles);
    for (let article of articles) {
      const authorWrapper = article.querySelector(opts.article.authors);
      // console.log(authorWrapper);
      let html = '';
      const authorName = article.getAttribute('data-author');
      // console.log(authorName);

      // const linkHTML = '<a href="#author-' + authorName + '">'+ authorName +'</a>';
      const linkHTMLData = { id: authorName, title: authorName };
      const linkHTML = templates.authorLink(linkHTMLData);

      // [NEW] check if this link is NOT already in allAuthors object */
      if (!allAuthors.hasOwnProperty(authorName)) {
        allAuthors[authorName] = 1;
      } else {
        allAuthors[authorName]++;
      }

      html = html + linkHTML;
      authorWrapper.innerHTML = templates.authorLink(linkHTMLData);
      // console.log(html);
    }

    const authorsList = document.querySelector(opts.listOf.authors);
    const allAuthorsData = { authors: [] };

    for (let authorName in allAuthors) {
      const authorNumber = allAuthors[authorName];
      const authorNameNumber = authorName + ' (' + authorNumber + ')';
      // console.log(authorNameNumber);

      allAuthorsData.authors.push({
        author: authorName,
        number: authorNumber,
        nameNumber: authorNameNumber,
      });
      // const authorLinkHTML = '<li><a href="#author-' + authorName + '">'+ authorNameNumber + '</a>';
      // console.log(authorLinkHTML);
      authorsList.innerHTML = templates.authorsList(allAuthorsData);
      // console.log(allAuthorsData);
    }
  }

  generateAuthors();

  //START of authorClickHandler function with event argument
  // prevent default action -
  // make clickedElement const -
  // create href from the href attr of clicked element -
  // create const author and extract author from the href constant -
  // find all author links with class active -
  // START loop for each active link -
  // remove class active -
  // END loop-
  // find all author links with href attr equal to the href constant -
  // START loop
  // add class active-
  // END loop -
  // exacute function generateTitleLinks with article selector as argument

  function authorClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    // console.log(href);
    const author = href.replace('#author-', '');
    // console.log(author);
    const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
    // console.log(activeAuthorLinks);
    for (let activeAuthorLink of activeAuthorLinks) {
      activeAuthorLink.classList.remove('active');
    }
    const sameAuthors = document.querySelectorAll('a[href="' + href + '"]');
    // console.log(sameAuthors);
    for (let sameAuthor of sameAuthors) {
      sameAuthor.classList.add('active');
    }
    generateTitleLinks('[data-author="' + author + '"]');
  }

  //START of addClickListenersToAuthors function
  // find all links to authors-
  // start loop for each author link-
  // add authorsClickHandler as event listener for that link-
  // end loop-
  function addClickListenersToAuthors() {
    const authorLinks = document.querySelectorAll('.posts .post-author a, .authors a');
    for (let authorLink of authorLinks) {
      // console.log(authorLink);
      authorLink.addEventListener('click', authorClickHandler);
    }
  }

  addClickListenersToAuthors();
}
