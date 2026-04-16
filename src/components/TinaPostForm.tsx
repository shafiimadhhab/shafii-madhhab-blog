import type { PostQuery, PostQueryVariables } from "../../tina/__generated__/types";
import { useTina } from "tinacms/dist/react";

interface Props {
  query: string;
  variables: PostQueryVariables;
  data: PostQuery;
}

export default function TinaPostForm(props: Props) {
  useTina<PostQuery>(props);

  return null;
}
