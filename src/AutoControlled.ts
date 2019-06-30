import { AnyObject } from './AnyObject';


/**
 * A set of standard methods to be implemented by a `React.Component` class.
 *
 * @export
 * @interface AutoControlled
 * @template State
 */
export interface AutoControlled<State extends AnyObject> {
  /**
   * Attempt to set state for props which are not controlled by the user.
   * 
   * Mimics the `setState()` React Component class method signature
   * with one exception that the new state is always an object.
   *
   * @param {object} maybeState State that corresponds to controlled props.
   * @param {object} callback Callback which is called after `setState` applied.
   */
  trySetState: (maybeState: Partial<State>, callback?: () => void) => void;
}
