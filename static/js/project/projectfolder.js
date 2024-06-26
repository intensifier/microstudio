this.ProjectFolder = class ProjectFolder {
  constructor(parent, name1) {
    this.parent = parent;
    this.name = name1;
    this.subfolders = [];
    this.files = [];
    this.open = false;
  }

  push(item, path = item.name) {
    var f, fold, folders;
    folders = path.split("-");
    if (folders.length > 1) {
      f = folders.splice(0, 1)[0];
      fold = this.getSubFolder(f);
      if (!fold) {
        fold = this.createSubFolder(f);
      }
      fold.push(item, folders.join("-"));
    } else {
      this.files.push(item);
      item.parent = this;
    }
    return item;
  }

  // add:(file,path)->
  //   if not path?
  //     path = file.name.split["-"]

  //   if file instanceof ProjectFolder
  //     @subfolders.push file
  //   else
  //     @files.push file
  getSubFolder(name) {
    var f, j, len, ref;
    ref = this.subfolders;
    for (j = 0, len = ref.length; j < len; j++) {
      f = ref[j];
      if (name === f.name) {
        return f;
      }
    }
    return null;
  }

  isAncestorOf(f) {
    if (this.subfolders.indexOf(f) >= 0) {
      return true;
    }
    if (f.parent != null) {
      return this.isAncestorOf(f.parent);
    } else {
      return false;
    }
  }

  getAllFiles() {
    var f, j, len, list, ref;
    list = [];
    list = list.concat(this.files);
    ref = this.subfolders;
    for (j = 0, len = ref.length; j < len; j++) {
      f = ref[j];
      list = list.concat(f.getAllFiles());
    }
    return list;
  }

  createSubFolder(name) {
    var f;
    f = new ProjectFolder(this, name);
    this.subfolders.push(f);
    return f;
  }

  containsFiles() {
    var f, j, len, ref;
    if (this.files.length > 0) {
      return true;
    } else {
      ref = this.subfolders;
      for (j = 0, len = ref.length; j < len; j++) {
        f = ref[j];
        if (f.containsFiles()) {
          return true;
        }
      }
    }
    return false;
  }

  delete() {
    if (this.parent != null) {
      this.parent.removeFolder(this);
    }
    if ((this.element != null) && (this.element.parentNode != null)) {
      return this.element.parentNode.removeChild(this.element);
    }
  }

  addFolder(f) {
    if (f.parent != null) {
      f.parent.removeFolder(f);
    }
    this.subfolders.push(f);
    return f.parent = this;
  }

  removeFolder(f) {
    var index;
    index = this.subfolders.indexOf(f);
    if (index >= 0) {
      return this.subfolders.splice(index, 1);
    }
  }

  createEmptyFolder() {
    var count, f, name;
    count = 1;
    name = "folder";
    while (this.getSubFolder(name) != null) {
      count += 1;
      name = `folder${count}`;
    }
    f = new ProjectFolder(this, name);
    this.subfolders.push(f);
    return f;
  }

  getFullDashPath() {
    if ((this.parent != null) && (this.parent.parent != null)) {
      return this.parent.getFullDashPath() + "-" + this.name;
    } else {
      return this.name;
    }
  }

  removeNoMatch(list) {
    var f, i, j, k, len, ref, ref1;
    ref = this.subfolders;
    for (j = 0, len = ref.length; j < len; j++) {
      f = ref[j];
      f.removeNoMatch(list);
    }
    for (i = k = ref1 = this.files.length - 1; k >= 0; i = k += -1) {
      f = this.files[i];
      if (list.indexOf(f.filename) < 0) {
        this.files.splice(i, 1);
      }
    }
  }

  removeEmptyFolders() {
    var f, i, j, ref;
    for (i = j = ref = this.subfolders.length - 1; j >= 0; i = j += -1) {
      f = this.subfolders[i];
      f.removeEmptyFolders();
      if (f.subfolders.length === 0 && f.files.length === 0 && !f.protected) {
        this.subfolders.splice(i, 1);
      }
    }
  }

  sort() {
    var f, j, len, ref;
    ref = this.subfolders;
    for (j = 0, len = ref.length; j < len; j++) {
      f = ref[j];
      f.sort();
    }
    this.subfolders.sort(function(a, b) {
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });
    return this.files.sort(function(a, b) {
      if (a.shortname < b.shortname) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  setElement(element) {
    this.element = element;
    return this.setOpen(this.open);
  }

  setOpen(open) {
    this.open = open;
    if (this.element != null) {
      if (this.open) {
        return this.element.classList.add("open");
      } else {
        return this.element.classList.remove("open");
      }
    }
  }

  find() {}

  remove() {}

};
