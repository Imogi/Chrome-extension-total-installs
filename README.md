<img src="src/App/assets/icons/total-chrome-installs-banner.png" alt="readme banner" width="1267" height="250" >

# Table of Contents

<!-- - [How to Install](#how-to-install) -->

- [Introduction](#introduction)
- [Background and Motivation](#background-and-motivation)
- [Programming languages and frameworks](#programming-languages-and-frameworks)
- [Features](#features)
- [Why few commits to master branch](#why-few-commits-to-master-branch)
- [UI and UX Decisions](#ui-and-ux-decisions)
- [Validation](#validation)
- [Issues faced](#issues-faced)
- [Manifest v3 installing external library issue](#manifest-v3-installing-external-library-issue)
- [What we learnt](#what-we-learnt)
- [License](#license)

<a name="introduction"></a>

# Introduction

<a name="background-and-motivation"></a>

## Background and Motivation

Following the publishing of one of our developers Chrome extension (Spotto), it was found that Chrome developers are unable to retrieve the number of total installations by users when inspecting statistics of their own Chrome extension unless they manually ran through the data. What is provided to Chrome Developers is two separate csv files. First being total downloads per day since published. Second is total downloads per day since published, sorted by the Country downloaded from.

As developers it is inconvenient to scroll through and analyse the statistics of each file. Due to this, it was in our interest to develop a Chrome extension that would be able to parse both aforementioned csv files, visualise them and display the statistics to be more easily understood for Chrome extension developers.

<!-- <a name="how-to-install"></a>

## How to Install

TBD -->

<a name="programming-languages-and-frameworks"></a>

## Programming languages and frameworks

This project utilizes HTML, CSS and pure JavaScript. Bootstrap is additionally used as the framework to help design the extension.

<a name="features"></a>

## Features

- Home Page: Upload total installations csv file to find total uploads
- Visualiser Page: Upload either countries or total installations csv files to visualize their data into graphs

<a name="why-few-commits-to-master-branch"></a>

## Why few commits to master branch

Due to poor management (and some laziness ☹), there were a lack of branches for specific features. Obviously, it is desired to have separate branches for each new feature, so the central code base is unaffected when multiple developers are collaborating on the project. Fortunately, this didn’t impact too much as this project was relatively small, however for future projects (as good practice), early planning for features should be done prior to development to prevent lack of feature branches (or create new branches as the project progresses).

<a name="ui-and-ux-decisions"></a>

# UI and UX Decisions

It was decided that for the UI, we would make it as simple as possible. It is why all features are displayed on their own pages without the need of scrolling to make it as intuitive as possible. Graphs that display the data are lusher and richer in color in comparison to the rest of the extension. This is so that the user can more easily analyse their data without a distracting background.

For user experience, alerts were put in place so that there is a more compelling feeling of user feedback. These alerts will appear when a valid or invalid file is selected to be visualised. A color change of the visualise button also occurs to indicate the file has been selected. Additionally, if there is no data for the current period, both visualiser subpages will display a placeholder graph to indicate no current data. These all help to strengthen the user interaction with the extension.

## Validation

The alerts as previously mentioned work due to a validation step. This is crucial as we do not want to submit an invalid file when parsing. How the validation works is it reads lines of the csv file and responds accordingly if the csv file is in correct format. If it is valid, then it will continue accordingly. If not, an alert will be invoked and will appear on the screen for the user to see. The message of the alert will correspond to what file was submitted on which page. Once again, this is just so the user has a good user experience.

<a name="issues-faced"></a>

# Issues faced

First issue faced was building and completing the overlay submission button with an animation on the home page. There were a lot of underlying bugs that appeared from developing this feature such as when hovering after submission, it flickers between the pre and post states of a valid submission. After many attempts of trying to fix this, we found that the animation code had to be refactored as well as adding a clear file button fixes all the issues resulting in perfect functionality of this feature.

<a name="manifest-v3-installing-external-library-issue"></a>

## Manifest v3 installing external library issue

When we tried to utilise the Chart.js library to display the graphs, it was found that manifest v3 did not allow the use of third-party libraries. This was a result from configuration changes from manifiest v2 to v3. As such, we had to find a wrap around to this problem since Chart.js was a crucial library that would help us build our features. After some discussion, it was decided it would be best to install the Chart.js as a package in the ‘node_modules’ folder and add it as a dependency. From this, the library was accessible from our JavaScript code.

However, our next issue was that creating an instance Chart from the library would not work. Our first script tag was:

- <script src="/src/node_modules/chart.js/dist/chart.js"></script>

This script tag would not work. We ran into a lot of circles trying to figure out the issue. Was it that the dependency was not installed correctly? Nope! It was that the path of the script tag to the module was incorrect. The new correct path of the script tag was:

- <script src="../../node_modules/chart.js/dist/chart.js"></script>

We figured out that the path is supposed to be relative to where the module is in the directory. Using the ‘../’, this enabled us to correctly path the file to the module (through moving back two directory levels).

<a name="what-we-learnt"></a>

# What we learnt

Without a doubt, this project helped us ferment our already knowledge and learn new things about HTML, CSS and JavaScript. Through development of this project, it has helped us get a better grasp of the importance of UI and UX decisions for the intended users. These decisions were influenced by the feedback from peer and friend assessment during different stages of development. From these usability tests, participant behavior influenced a lot of the aesthetic changes to the project resulting in the final product. One of the changes was the inclusion of a new graph on the total installations visualiser page. From feedback, it was indicated that breaking down the downloads by each quarter of each year would be much more easily understood.

From fixing the overlay button bug highlighted a large issue with pure JavaScript being that each state needs to be manually resolved when the feature changes states. Furthermore, the features that involved the csv parsing had to incorporate asynchronous programming. This helped us explore this concept further to where we are much more comfortable with it.

By the end, all obstacles faced has helped progress our knowledge on the limits to which pure JavaScript has and in addition, strengthening our understanding on the processes of project development.

<a name="license"></a>

# License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Imogi/Chrome-extension-total-installs/blob/main/LICENSE) file for details
