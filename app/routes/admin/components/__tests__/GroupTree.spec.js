import React from 'react';

import GroupTree from '../GroupTree';
import TreeView from 'react-treeview';
import { shallow } from 'enzyme';
import { Link } from 'react-router';

const groups = [
  {
    description: 'cool group',
    id: 1,
    name: 'Cat'
  },
  {
    description: 'bad group',
    id: 2,
    name: 'Dog',
    parent: 1
  },
  {
    description: 'standalone group',
    id: 3,
    name: 'Bird'
  }
];

describe('components', () => {
  describe('GroupTree', () => {
    it('should render the child nodes as links', () => {
      const wrapper = shallow(<GroupTree groups={groups} />);
      expect(wrapper.contains(<Link to='/admin/groups/2/settings'>Dog</Link>)).to.equal(true);
      expect(wrapper.contains(<Link to='/admin/groups/3/settings'>Bird</Link>)).to.equal(true);
    });

    it('should render the root nodes correctly', () => {
      const children = shallow(<GroupTree groups={groups} />).children();
      expect(children.at(1).is(TreeView)).to.equal(true);
      expect(children.at(2).is('div')).to.equal(true);
    });

    it('should work with no groups', () => {
      const children = shallow(<GroupTree groups={[]} />).children();
      expect(children.contains(<h3>Groups</h3>)).to.equal(true);
    });

    it('should work with only root groups', () => {
      const rootGroups = groups.slice(0, 1);
      const wrapper = shallow(<GroupTree groups={rootGroups} />);
      const links = wrapper.find(Link);
      expect(wrapper.find(TreeView).isEmpty()).to.equal(true);
      expect(links.length).to.equal(1);
    });
  });
});
