const API_VER = 'latest';

export default class TeamcityService {

  constructor(dashboardApi) {
    this.dashboardApi = dashboardApi;
  }

  async getProjects(teamcityService) {
    const [projectResponse, buildTypeResponse] = await Promise.all([
      this._fetchTeamcity(teamcityService, 'projects', {
        locator: 'archived:false',
        fields: 'project(id,name,parentProjectId,archived)'
      }),
      this._fetchTeamcity(teamcityService, 'buildTypes', {
        fields: 'buildType(id,name,projectId)'
      })
    ]);

    const projects = projectResponse.project.filter(it => it.id !== '_Root');
    const buildTypes = buildTypeResponse.buildType;

    const projectMap = {};
    projects.forEach(it => (projectMap[it.id] = it));

    const roots = TeamcityService._buildTree(projects, projectMap, buildTypes);
    return TeamcityService._flattenTree(roots);
  }

  async getBuildInfo(
    teamcityService, buildType, showLastSuccessful,
    showLastPinned, tags, branch, path = ''
  ) {
    const buildTypePart = `buildType:${buildType.id}`;
    const statusPart = showLastSuccessful && 'status:SUCCESS';
    const pinnedPart = `pinned:${showLastPinned ? true : 'any'}`;
    const tagsPart = tags && `tags:${tags}`;
    const branchPart = `branch:(${branch ? branch : 'default:true'})`;
    const locator = [buildTypePart, statusPart, pinnedPart, branchPart, tagsPart].
      filter(it => it).
      join(',');
    return await this._fetchTeamcity(
      teamcityService,
      `builds/${locator}${path}`
    );
  }

  async getArtifacts(
    teamcityService, buildType, showLastSuccessful,
    showLastPinned, tags, branch, path = ''
  ) {
    return (await this.getBuildInfo(
      teamcityService, buildType, showLastSuccessful,
      showLastPinned, tags, branch, `/artifacts/children${path}`
    )).file;
  }

  static _buildTree(projects, projectMap, buildTypes) {
    // Build a forest of projects
    const roots = [];
    projects.forEach(project => {
      const parent = projectMap[project.parentProjectId];
      if (parent) {
        const children = parent.children || [];
        children.push(project);
        parent.children = children;
        project.parent = parent;
      } else {
        roots.push(project);
      }
    });

    buildTypes.forEach(buildType => {
      const parent = projectMap[buildType.projectId];
      if (parent) {
        const childBuildTypes = parent.buildTypes || [];
        childBuildTypes.push(buildType);
        parent.buildTypes = childBuildTypes;
        buildType.parent = parent;
        buildType.isBuildType = true;
      }
    });

    projects.forEach(project => {
      project.path = TeamcityService._getPath(project);
    });
    buildTypes.forEach(buildType => {
      buildType.path = TeamcityService._getPath(buildType);
    });

    return roots;
  }

  /**
   * Returns a path to a tree node
   *
   * @param {{name: string, parent: object}} node - tree node to build path for
   * @return {string} - path to a tree node
   */
  static _getPath(node) {
    const path = [];
    for (let cur = node; cur != null; cur = cur.parent) {
      path.unshift(cur.name);
    }
    return path.join(' :: ');
  }

  static _flattenTree(roots) {
    const flattenProjects = [];
    let currentLevel = 0;

    function flattenTree(node) {
      node.level = currentLevel;
      flattenProjects.push(node);
      currentLevel++;
      if (node.buildTypes) {
        node.buildTypes.forEach(flattenTree);
      }
      if (node.children) {
        node.children.forEach(flattenTree);
      }
      currentLevel--;
    }

    roots.forEach(flattenTree);

    return flattenProjects;

  }

  async _fetchTeamcity(teamcityService, path, query) {
    return await this.dashboardApi.fetch(
      teamcityService.id,
      `app/rest/${API_VER}/${path}`,
      {
        query,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });
  }
}
