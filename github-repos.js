GITHUB_JSON_URL = "http://github.com/api/v1/json/{0}?callback={1}";
DYNAMIC_SCRIPT_TEMPLATE = "<script src='{0}' type='text/javascript' ></script>";
GITHUB_PROJECTS_CLASS = ".github-projects";
REPO_TEMPLATE =
    "<div class='github-repo'>"
    +   "<a href='{0}' target='_blank'>"
    +  	  "{1}<img class='github-repo-link-image'"
    +           "src='http://erlanguid.com/icons/external.png'"
    +	  "</a>"
    +"</div>";

var GitHubRepos = new function(){

    this.displayObjects = new Array();

    //retrieve the repo information from github    
    this.GetRepos = function()
    {
        //create an array of the github data, used to prevent mutiple hits
        //to the server for the same user
        var github_usernames = new Array();

        //for all the github-projects divs 
        $(GITHUB_PROJECTS_CLASS).each(function(i) {

            //create an array of all unique userids in the page
            if(this.id != undefined)
            {

                var username = this.id;
                //add this object (div by default) that met the query parameters
                //to a list to be altered later
                if( GitHubRepos.displayObjects[username] == undefined)
                {
                   GitHubRepos.displayObjects[username] = new Array(); 
                }

                GitHubRepos.displayObjects[username][i] = this;
            }

        });   

        //for each unique user
        for(var i in GitHubRepos.displayObjects)
        {
            //format the github url for our given user and callback function
            var github_url = format(GITHUB_JSON_URL, i, "GitHubRepos.DisplayRepos");

            //insert a script into the DOM to add our JSON data via the github url
            //once the script loads it will callback the DATA_DISPLAY_FUCNTION
            $('head').append(format(DYNAMIC_SCRIPT_TEMPLATE, github_url));

        }
    }

    //add the repo data to the div using the template
    this.DisplayRepos = function(data)
    {
        //if we got properly formed data
        if(data.user != undefined)
        {
            var user = data.user;

            //for all the div objects that correspond to that user
            for(var j in GitHubRepos.displayObjects[user.login])
            {
                var proj_div = GitHubRepos.displayObjects[user.login][j];
                 
                //for each of the user repositories in the data
                $.each(user.repositories, function(i, repo) {

                    //add the templated information to the divs existing content
                    proj_div.innerHTML = proj_div.innerHTML + format(REPO_TEMPLATE, repo.url, repo.name);
              
                });

                //the style div.github-projects is display: none by default
                //display it if there was no error message
                proj_div.style.display = "block";
            }
            
        }
    } 
}

//used to create clean insertion of strings into templates
function format(str)
{
    for(i = 1; i < arguments.length; i++)
    {
        str = str.replace("{" + (i - 1) + "}", arguments[i]);
    }
    return str;
}

//Go Get Those REPOS!
$(document).ready(function(){ 

    GitHubRepos.GetRepos();

});




