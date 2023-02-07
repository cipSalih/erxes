import React from 'react';
import { useQuery, useMutation } from 'react-apollo';
import { queries, mutations } from '../../graphql';
import Form from '../../components/permission/PermissionGroupForm';
import { useParams, useHistory } from 'react-router-dom';
import gql from 'graphql-tag';

const PermissionGroupEdit: React.FC = () => {
  const { permissionGroupId } = useParams();
  const history = useHistory();

  const { data, loading, error } = useQuery(gql(queries.permissionGroupQuery), {
    variables: {
      _id: permissionGroupId
    }
  });

  const [patchMut] = useMutation(gql(mutations.permissionGroupPatch), {
    onCompleted: () => {
      history.push(`/forums/permission-groups/${permissionGroupId}`);
    },
    onError: e => {
      alert(JSON.stringify(e, null, 2));
    },
    refetchQueries: queries.permissionGroupRefetch
  });

  if (loading) {
    return null;
  }
  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  const onSubmit = async variables => {
    await patchMut({
      variables: {
        ...variables,
        _id: permissionGroupId
      }
    });
  };

  return (
    <div>
      <h3>Edit permission group</h3>
      <Form permissionGroup={data.forumPermissionGroup} onSubmit={onSubmit} />
    </div>
  );
};

export default PermissionGroupEdit;
