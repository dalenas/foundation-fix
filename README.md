# Engineering Project - Foundation Mixture Creator
## Before PM5
- finish all code
- update engineer report as we go
- begin testing

---

# BRANCH RULES
- BEFORE YOU BEGIN UPDATING FILES check which branch you're on
- please dont update unrelated files on the wrong branch 
  - for example please dont update files related to UI/UX design feature/image-processing
- NEVER commit directly to main
- push/pull once you've finished coding for the day or you need to switch collaborators

## current branches and their uses
You may add a new branch with this command but be sure to update README.md with what the branch is for. Or communicate it to one of the Software Team and we can do it for you. 
```bash
git checkout -b new_branch_name
```

### backend development
**feature/image-processing** related to image processing algorithms that gamma correct and adjust for inconsistent lighting
**feature/region-of-interest** related to image capture and defining skin/reference card regions

### hardware/electrical teams
**file-update** place to upload files like CAD or electrical system diagrams

### for all editors
**report** this branch is for us to edit the final engineering report so make sure if you update the tex file its through here

---

# Git Instructions
**pre coding** : ASK collaborators if they're on a branch editing right now and if they can push their changes to the branch so you can edit. 

**1. get to the branch you want to edit**
```bash
git checkout branch_name
```
- *make sure you spell the branch right because if its not spelled right, it will create a new branch with the typo.*

**2. pull from main branch**
```bash
git pull origin main
```
**3. code**

**4. "stage" files. this is just you defining which files you're ready to commit**
```bash
git add .
```
- *this adds all files you've edited during your coding session*
```bash
git add "filename"
```
- *adds individual files one at a time*

**5. commit with an appropriate message that describes what you did briefly**
```bash
git commit -m "Description of actions taken."
```

**6. you can code and commit however many times but if someone else needs to use your branch, or you just want to close up for the day this is what youd do.**
```bash
git push origin branch_name
```

**7. at the end, if you're done with the feature that the branch is for, merge to main
go to github, switch to main branch, and create a pull request for the branch you just worked on. if the feature is absolutely complete, merge and delete. if you still need to use the branch, obviously dont delete it.** 
---

## Software Requirements (Abridged)
1. Pi Camera → capture frame 
2. OpenCV → face detection → skin mask → robust skin color
3. Convert RGB to XYZ -> removes camera bias (gamma to normal RGB to XYZ)
4. Convert to Lab → compare with skin shade DB in Lab. 
5. Convert pigment volumes → servo turns → push syringes via leadscrews.
6. Show on-screen: target shade, chosen shade, other options for shades (cooler tone/warmer tone. this is optional though)