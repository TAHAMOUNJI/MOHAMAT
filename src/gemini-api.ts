import { ListDirectoryFileFilteringOptions, ReadManyFilesFileFilteringOptions } from './types/index';

export const default_api = {
  list_directory: (path: string, file_filtering_options?: ListDirectoryFileFilteringOptions, ignore?: string[]) => Promise.resolve({}),
  read_file: (absolute_path: string, limit?: number, offset?: number) => Promise.resolve({}),
  search_file_content: (pattern: string, include?: string, path?: string) => Promise.resolve({}),
  glob: (pattern: string, case_sensitive?: boolean, path?: string, respect_git_ignore?: boolean) => Promise.resolve({}),
  replace: (file_path: string, old_string: string, new_string: string, expected_replacements?: number) => Promise.resolve({}),
  write_file: (file_path: string, content: string) => Promise.resolve({}),
  web_fetch: (prompt: string) => Promise.resolve({}),
  read_many_files: (paths: string[], exclude?: string[], file_filtering_options?: ReadManyFilesFileFilteringOptions, include?: string[], recursive?: boolean, useDefaultExcludes?: boolean) => Promise.resolve({}),
  run_shell_command: (command: string, description?: string, directory?: string) => Promise.resolve({}),
  save_memory: (fact: string) => Promise.resolve({}),
  google_web_search: (query: string) => Promise.resolve({}),
};