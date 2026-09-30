import PropTypes from "prop-types";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const getPanelMotion = (reduceMotion) =>
  reduceMotion
    ? {
        initial: false,
        animate: {},
        exit: {},
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, y: -4, scaleY: 0.98 },
        animate: { opacity: 1, y: 0, scaleY: 1 },
        exit: { opacity: 0, y: -4, scaleY: 0.98 },
        transition: { duration: 0.16, ease: "easeOut" },
      };

export const AnimatedPanel = ({ open, children, className = "", as = "div" }) => {
  const reduceMotion = useReducedMotion();
  const MotionComponent = as === "ul" ? motion.ul : motion.div;
  const motionProps = getPanelMotion(reduceMotion);

  return (
    <AnimatePresence initial={false}>
      {open && (
        <MotionComponent
          {...motionProps}
          className={`origin-top overflow-hidden ${className}`}
        >
          {children}
        </MotionComponent>
      )}
    </AnimatePresence>
  );
};

AnimatedPanel.propTypes = {
  open: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  as: PropTypes.oneOf(["div", "ul"]),
};

export const AnimatedSubmenu = (props) => <AnimatedPanel {...props} as="ul" />;

AnimatedSubmenu.propTypes = AnimatedPanel.propTypes;
