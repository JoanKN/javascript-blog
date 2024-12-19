/* eslint-disable no-unused-vars */
/* eslint-disable no-inner-declarations */
//document.getElementById('test-button').addEventListener('click', function(){
//const links = document.querySelectorAll('.titles a');
//console.log('links:', links);
// });
{
  'use strict';
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
  const titleClickHandler = function (event) {
    event.preventDefault();
    const clickedElement = this;
    console.log('Link was clicked!');

    /* [DONE] remove class 'active' from all article links  */

    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }

    /* [DONE] add class 'active' to the clicked link */

    clickedElement.classList.add('active');
    /*console.log('clickedElement:', clickedElement);*/

    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts .active');

    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }

    /* [DONE] get 'href' attribute from the clicked link */

    const articleSelector = clickedElement.getAttribute('href');
    /*console.log(articleSelector);*/

    /* [DONE] find the correct article using the selector (value of 'href' attribute) */

    let targetArticle = document.querySelector(articleSelector);
    /*console.log(targetArticle);*/

    /* [DONE] add class 'active' to the correct article */
    targetArticle.classList.add('active');
    console.log(event);
  };

  // eslint-disable-next-line no-inner-declarations
  function generateTitleLinks(customSelector = '') {
    /* remove contents of titleList */
    const titleList = document.querySelector(opts.listOf.titles);
    titleList.innerHTML = '';
    /*console.log(titleList);*/
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

      const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
      /* insert link into titleList */
      html = html + linkHTML;
      /*console.log(html);*/
    }
    titleList.innerHTML = html;
    const links = document.querySelectorAll('.titles a');

    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  }
  generateTitleLinks();
  function calculateTagsParams(tags){
    const params = {max: 0, min: 999999};
    for (let tag in tags) {
      if(tags[tag] > params.max){
        params.max = tags[tag];
      }
      if(tags[tag] < params.min){
        params.min = tags[tag];
      }
      console.log(tag + ' is used ' + tags[tag] + ' times');
    }
    return params;
    console.log(params);
  }
  function calculateTagClass(count, params){
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    console.log(percentage);
    const classNumber = Math.floor( percentage * (opts.tagSizes.count - 1) + 1 );
    console.log(classNumber);
    return opts.tagSizes.classPrefix + classNumber;
    // const tagClassName = opts.tagSizes.classPrefix + opts.tagSizes.count;
    // console.log(tagClassName);
  }

  function generateTags() {
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};
    /* find all articles */
    const articles = document.querySelectorAll(opts.all.articles);
    /* START LOOP: for every article: */
    for (let article of articles) {
      /* find tags wrapper */
      const tagsWrapper = article.querySelector(opts.article.tags);
      /*console.log(tagsWrapper);*/
      /* make html variable with empty string */
      let html = '';
      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');
      /*console.log(articleTags);*/
      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
      console.log(articleTagsArray);
      /* START LOOP: for each tag */
      for (let tag of articleTagsArray) {
        /*console.log('nazwa tagu to' + tag);*/
        /* generate HTML of the link */
        const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
        /*console.log(linkHTML);*/
        /* add generated code to html variable */
        html = html + linkHTML;
        /*console.log(html);*/
        /* [NEW] check if this link is NOT already in allTags */
        if(!allTags.hasOwnProperty(tag)){
          /* [NEW] add tag to allTags object */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
        /* END LOOP: for each tag */
      }
      /* insert HTML of all the links into the tags wrapper */
      tagsWrapper.innerHTML = html;
      /* END LOOP: for every article: */
    }
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector(opts.listOf.tags);
    /* [NEW] create variable for all links HTML code */
    const tagsParams = calculateTagsParams(allTags);
    console.log('tagsParams:', tagsParams);
    let allTagsHTML = '';

    /* [NEW] START LOOP: for each tag in allTags: */
    for (let tag in allTags) {
      /* [NEW] generate code of a link and add it to allTagsHTML */
      //allTagsHTML += tag + ' (' + allTags[tag] + ') ';
      const tagLinkHTML = '<li>' + calculateTagClass(allTags[tag], tagsParams) + '</li>';
      console.log('tagLinkHTML:', tagLinkHTML);
      allTagsHTML += tagLinkHTML;
    }
    /* [NEW] END LOOP: for each tag in allTags: */

    /*[NEW] add HTML from allTagsHTML to tagList */
    tagList.innerHTML = allTagsHTML;
  }
  generateTags();

  function tagClickHandler(event) {
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    console.log('Link was clicked!');
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    console.log(href);
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
      sameTag.classList.add('active');
      /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }

  function addClickListenersToTags() {
    /* find all links to tags */
    const tagLinks = document.querySelectorAll('.post-tags .list a');
    /* START LOOP: for each link */
    for (let tagLink of tagLinks) {
      /* add tagClickHandler as event listener for that link */
      tagLink.addEventListener('click', tagClickHandler);
      /* END LOOP: for each link */
    }
  }
  addClickListenersToTags();
  function generateAuthors() {
    const articles = document.querySelectorAll(opts.all.articles);
    for (let article of articles) {
      const authorWrapper = article.querySelector(opts.article.authors);
      /*console.log(authorWrapper);*/
      let html = '';
      const articleAuthor = article.getAttribute('data-author');
      console.log(articleAuthor);
      const linkHTML = '<a href="#' + opts.article.authors + '"><span>' + articleAuthor + '</span></a>';
      /*console.log(linkHTML);*/
      authorWrapper.innerHTML = linkHTML;
    }
  }
  generateAuthors();
  function authorClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;
    /*console.log('Link was clicked!');*/
    const author = clickedElement.getAttribute('data-author');
    /*console.log(author);*/
    const activeAuthorLinks = document.querySelectorAll('a.active[data-author]');
    for (let activeAuthorLink of activeAuthorLinks) {
      activeAuthorLink.classList.remove('active');
    }
    const sameAuthors = document.querySelectorAll('data-author' + author + '"]');
    for (let sameAuthor of sameAuthors) {
      sameAuthor.classList.add('active');
    }
    generateTitleLinks('[data-author="' + author + '"]');
  }
  function addClickListenersToAuthors() {
    const authorLinks = document.querySelectorAll(opts.article.authors);
    for (let authorLink of authorLinks) {
      authorLink.addEventListener('click', authorClickHandler);
    }
  }
  addClickListenersToAuthors();
}

